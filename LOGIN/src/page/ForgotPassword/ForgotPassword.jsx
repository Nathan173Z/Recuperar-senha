import api from '../../services/api'
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
     Button,
     Alert,
     AlertIcon, 
     AlertDescription } from '@chakra-ui/react'
import { useState } from 'react'

    

export function forgotpassword(){

    const [status, setStatus] = useState({
        type: '',
        mensagem: '',
        loading: false
      })
      const [value, setValue] = useState({
        email: ""
      })
      const[estado, setEstado] = useState(false)
    
      const handleChange = e =>{
         setValue({
          ...value,
          [e.target.name] : e.target.value
      
        })
      }

      const formSubmit = async e =>{
    e.preventDefault()
    setEstado(false)

    setStatus({loading: true})
    console.log(value)
    
    const headers = {
      'headers': {
        'Content-Type': 'application/json'
      }
    }
    await api.put('/users/forgot_password', value, headers)
    .then((response)=>{
        setStatus({
          type: "success",
          mensagem: response.data.mensagem,
          loading: false
        })
        setValue({
          email: ""
        })
    }).catch((err)=>{
      if(err.response.data){
        setStatus({
          type: 'error',
          mensagem: err.response.data.mensagem,
          loading: false
        })
        setEstado(true)
      }else{
        setStatus({
          type: 'error',
          mensagem: 'Erro: tente mais tarde',
          loading: false
        })
      }
    })
  } 

    return (
        <ChakraProvider >
        <HStack w="full" h="108vh">
            <Flex w="full" align="center" justify="center">
                <Stack w="full" maxW="xl" spacing={6} p={6} onSubmit={formSubmit} as="form">
                      {status.type &&(
                  <Alert status={status.type} variant='solid'>
                    <AlertIcon />
                    <AlertDescription>{status.mensagem}</AlertDescription>
                  </Alert>
                  )}

                    <Heading fontSize ="2em" textAlign="center" color="purple.500"> RECUPERAR SENHA </Heading>

                    <FormControl id="user">
                        <FormLabel >E-mail</FormLabel>
                        <Input name="email" placeholder="example@gmail.com"value={value.email} onChange={handleChange} isInvalid={estado} />
                    </FormControl>
                        <Button colorScheme="purple" isLoading={status.loading} loadingText='Enviando' type="submit" >Enviar</Button>
                </Stack>
            </Flex>
        </HStack>
        </ChakraProvider>
)
};


    