import React, {useState, useContext} from "react";
import { useHistory } from 'react-router-dom'; 
import api from '../../services/api';
import 
    {HStack,
     Flex, 
     Box, 
     Heading, 
     Stack, 
     FormControl, 
     FormLabel, 
     Input, Checkbox, 
     Link, 
     ChakraProvider,
     Button } from '@chakra-ui/react'

import { Context } from '../../Context/AuthContext';


export function Login(){
    const history = useHistory();
    const { authenticated, signIn } = useContext(Context);
    const [user, setUser] = useState(
        {
            email: '',
            password:''
        }
    )
    const [status, setStatus] = useState({
        type: '',
        mensagem: '',
        loading: false
    })
    const valorInput = e => setUser({ 
        ...user, 
        [e.target.name]: e.target.value
    })
    const loginSubmit = async e =>{
        e.preventDefault();
    
        setStatus({
            loading:true
        });
        const headers = {
            'Content-Type': 'application/json'
        }
        await api.post("/users/login", user, {headers})
        .then((response) =>{
            setStatus({
                loading:false
            });
            localStorage.setItem('token', response.data.token);    
            signIn(true);
            return history.push('/dashboard');
        }).catch((err) =>{
            setStatus({
              type:'error',
              mensagem: 'Erro: tente mais tarde',
              loading:false
            })
            if(err.response){
                setStatus({
                    type:'error',
                    mensagem: err.response.data.mensagem,
                    loading:false
                })
            }  
        })
    }


    return (
       <>
            <ChakraProvider>
        <HStack onSubmit={loginSubmit} as="form" w="full" h="108vh" >

            <Flex w="full" h="full" display={{base: 'none', md: 'flex'}} borderRightWidth={1}>          
                <Box objectFit="cover" w="full" h="full" bgColor="gray.800"/> 
            <Link
            fontSize ="6em"pos="absolute" bottom="4em" left="1.5em"color="purple.500">Criar conta</Link>

            </Flex>
            <Flex w="full"align="center" justify="center">
                <Stack w="full" maxW="xl" spacing={6} p={6}>
                    <Heading fontSize ="2em" textAlign="center" color="purple.500"> LOGAR </Heading>

                    <FormControl id="user">
                        <FormLabel>E-mail</FormLabel>
                        <Input type="email" name="email" onChange={valorInput} value={user.email} placeholder="example@gmail.com" />
                    </FormControl>

                    <FormControl id="password">
                        <FormLabel> Senha </FormLabel>
                        <Input type="password" name="password" onChange={valorInput} value={user.password} placeholder="............." />
                    </FormControl>

                    <Stack spacing={4} direction="row" aling="start" justify="space=between">
                        <Checkbox colorSheme="purple">Lembrar senha</Checkbox>
                        <Link color="purple.500"  href='/ForgotPassword' >Esqueceu a senha?</Link></Stack>
                        <Button colorScheme="purple" type="submit">Entrar</Button>
                </Stack>
            </Flex>
        </HStack>
        </ChakraProvider>   
        </>
    )
}