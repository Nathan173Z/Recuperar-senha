const Users = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {recoverypasscorp} = require('../Usermail/forgot_password');
const sendMail = require('../nodemailler/mailProvider')
const crypto = require('crypto');



exports.create =  async(req, res) =>{
  var dados = req.body;
  dados.password = await bcrypt.hash(dados.password, 8);


  await Users.create(dados)
  .then(()=>{
    return res.json({
      erro: false,
      mensagem: 'Usuário cadastrado com sucesso!'
    });
  }).catch((err)=>{
    return res.status(400).json({
      erro:true,
      mensagem: `Erro: Usuário não encontrado... ${err}`
    })
  })
}


exports.findAll = async(req,res)=>{
  await Users.findAll({
    attributes: ['id','name','email','gender', 'password'],
    order: [['id', 'ASC']]

  })
  .then((users) => {
    return res.json({
      erro: false,
      users
    });
  }).catch((err) => {
    return res.status(400).json({
      erro : true,
      mensagem: `Erro ${err} ou nenhum usuário encontrado!!!`
    })
  })
}


exports.update = async(req,res)=>{
  const {id} = req.body;

  await Users.update(req.body, {where: {id}})
  .then(()=>{
    return res.json({
      erro: false,
      mensagem: "Usuário alterado com sucesso!"
    })
  }).catch((err)=>{
    return res.status(400).json({
      erro: true,
      mensagem: `Erro: Usuário não encontrado ...${err}`
    })
  })
}
 

exports.findOne = async (req, res) =>{
  const {id} = req.params;
  try{
    const users = await Users.findByPk(id);
    if(!users){
      return res.status(400).json({
        erro: true,
        mensagem: "Erro:Nenhum usuário encontrado!"
      })
    }
    res.status(200).json({
      erro: false,
      users
    })
  }catch(err){
    res.status(400).json({
      erro: true,
      mensagem: `Erro ${err}`
    })
  }
}
 

exports.delete =  async(req,res)=>{
  const {id} = req.params;
  await Users.destroy({where: {id}})
  .then(()=>{
    return res.json({
      erro: false,
      mensagem: "Usuário apagado com sucesso!"
    });
  }).catch((err)=>{
    return res.status(400).json({
      erro: true,
      mensagem: `Erro: ${err} Usuário não apagado...`
    })
  })
}


exports.login =  async (req, res) => {
  const user = await Users.findOne({
      attributes: ['id', 'name', 'email', 'gender', 'password'],
      where: {
          email: req.body.email
      }
  })
  if(user === null){
      return res.status(400).json({
          erro: true,
          mensagem:"Erro: Email ou senha incorreta!!!"
      })
  }
  if(!(await bcrypt.compare(req.body.password, user.password))){
      return res.status(400).json({
          erro: true,
          mensagem: "Erro: Email ou senha incorreta!!!"
      })
  }
  var token = jwt.sign({id: user.id}, process.env.SECRET,{
    expiresIn: 1000 
  })
  return res.json({
    erro:false,
    mensagem: "Login realizado com sucesso!!!",
    token    
  })
}


exports.changepass =  async (req, res) => {
  const {id, password } = req.body;
  var senhaCrypt = await bcrypt.hash(password, 8);
  const users = await Users.findByPk(id);
  if(!users){
    return res.status(400).json({
      erro: true,
      mensagem: "Erro: Nenhum usuário encontrado!"
    })
  }

  
  await Users.update({password: senhaCrypt }, {where: {id: id}})
  .then(() => {
      return res.json({
          erro: false,
          mensagem: "Senha edita com sucesso!"
      }); 
  }).catch( (err) => {
      return res.status(400).json({
          erro: true,
          mensagem: `Erro: ${err}... A senha não foi alterada!!!`
      })
  })
}

exports.forgot_password = async (req,res) =>{

  const email = req.body.email
  const user = await Users.findOne({where: {email}})
  if(!user){
    return res.status(400).json({
      erro : true,
      mensagem : "Esse E-mail não existe"
    })
  }
  else{

    const token = crypto.randomBytes(20).toString('hex').substring(0,6)

    await Users.update({passwordResetToken: token},{where: {id: user.id} })
    .then(()=>{
    const dados = {
      name : user.name,
      token : token
    }

    const htmlbody = recoverypasscorp(dados)
    const subject = "Recupere o acesso a sua conta"
    const to = user.email
    sendMail(to,subject, htmlbody)
    return res.status(200).json({
      erro: false,
      mensagem: "Email enviado com sucesso",
      token
    })
    }).catch((err)=>{
      return res.status(400).json({
        erro: true,
        mensagem: `Erro: falha no envio do email! ${err}`
      })
    })
  }
}


exports.updatepassword = async(req,res) => {
  const {email,token, password, confirmpass} = req.body
  const user = await Users.findOne({where: {email}})
  if(!user || (password != confirmpass)){
    return res.status(400).json({
      erro: true,
      mensagem: "Email inválido e ou senhas não conferem!"
    })
  }
  if(token == user.passwordResetToken){
    const newpassword = await bcrypt.hash(password,8)
    await Users.update({password:newpassword},{where: {id: user.id}})
    .then(()=>{
      return res.status(200).json({
        erro: false,
        mensagem: "Senha alterada com sucesso"
      })
     }
    ).catch((err)=>{
        return res.status(400).json({
          erro: true,
          mensagem: `Erro: ${err}. Falha na alteração de senha`
        })
      })
  }
  else{
    return res.status(400).json({
      erro: true,
      mensagem: "Código inválido"
    })
  }
}
  
    