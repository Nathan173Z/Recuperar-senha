import api from '../../services/api'
import { useState } from 'react';
import React from 'react';
import 
    {HStack,
     Flex,  
     Heading, 
     Stack, 
     FormControl, 
     FormLabel, 
     Input, 
     ChakraProvider,
     Button } from '@chakra-ui/react'
     import { Alert,AlertIcon,
      AlertDescription} from '@chakra-ui/react'


      export function UpdatePassword(){

        const [status, setStatus] = useState({
          type: "",
          mensagem: "",
          loading: false
        })
        const [values, setValues] = useState({
          email: "",
          password: "",
          confirmpass: "",
          token : ""
        })
        const handleChange = (e)=>{
          setValues({
            ...values,
            [e.target.name] : e.target.value
          })
        }
      
        const formSubmit = async (e)=>{
          e.preventDefault()
          setStatus({loading: true})
          const headers = {
            'headers' : 'Content-Type : aplication/json'
          }
          await api.put('/users/updatepassword', values, headers)
          .then((response)=>{
            setStatus({
              type: 'success',
              mensagem: response.data.mensagem,
              loading: false
            })
            setValues({
              email: "",
              password: "",
              confirmpass: "",
              token : ""
            })
          })
          .catch((err)=>{
              if(err.response.data){
                setStatus({
                  type: 'error',
                  mensagem: err.response.data.mensagem,
                  loading: false
                })
              }
              else{
                setStatus({
                  type: 'error',
                  mensagem: 'Erro: tente mais tarde'
                })
              }
      
          })
      
        }
        
    return (
        <ChakraProvider >
        <HStack 
        w="full" 
        h="108vh">  
            <Flex 
            w="full"
             align="center" 
             justify="center">
                <Stack w="full"  maxW="xl" spacing={6} p={6}  onSubmit={formSubmit} as="form">
                {status.type &&(
          <Alert status={status.type} variant='solid'>
            <AlertIcon />
            <AlertDescription>{status.mensagem}</AlertDescription>
          </Alert>
          )}
                    <Heading fontSize ="2em" 
                    textAlign="center" 
                    color="purple.500">
                        RECUPERAR SENHA
                    </Heading>
                    <FormControl  id="user">
                        <FormLabel>E-mail</FormLabel>
                        <Input value={values.email} name="email" onChange={handleChange} placeholder="example@gmail.com" />
                    </FormControl>
                    <FormControl 
                    id="password">
                        <FormLabel>Senha</FormLabel>
                        <Input value={values.password} name ="password" onChange={handleChange} type="password" placeholder="............." />
                    </FormControl>
                    <FormControl 
                    id="password">
                        <FormLabel >Confirma Senha</FormLabel>
                        <Input name="confirmpass" value={values.confirmpass} onChange={handleChange}
                        type="password" 
                        placeholder="............." />
                    </FormControl>
                    <FormControl>
                        <FormLabel >Codigo Validação</FormLabel>
                        <Input name="token" value={values.token} onChange={handleChange}
                        type="text"/>
                    </FormControl>
                        <Button colorScheme="purple" isLoading={status.loading} type="submit" loadingText='Enviando' >Confirma</Button>
                </Stack>
            </Flex>
        </HStack>
        </ChakraProvider>
)
};
