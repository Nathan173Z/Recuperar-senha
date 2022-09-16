exports.recoverypasscorp = (dados) => {
    htmlbody += '<h1>Olá {name}!</h1>';
    htmlbody += '<h1>Deseja troca sua senha ? Acesso o link a baixo e valide o codigo para recuperar o acesso a sua conta</h1>'
    htmlbody += '<p><a target="_blank" href="http://127.0.0.1:5173/recoverypassword">Link para recuperar sua conta</a></p>'
    htmlbody += '<h2> Código:{token}</h2> '

    htmlbody = htmlbody.replace('{name}', dados.name);
    htmlbody = htmlbody.replace('{token}', dados.token);

      return htmlbody;
  }
