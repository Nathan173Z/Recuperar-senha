import React, {useContext} from 'react';

import { Context } from '../../../Context/AuthContext'
import { Navbar, Container, Form } from 'react-bootstrap'

export const NavBar = () =>{

    const { authenticated, handleLogout } = useContext(Context)

    return(
        <>
            <Navbar bg="dark" variant="dark">
                <Container>
                <Form className="d-flex">
                  
                </Form>                
                </Container>
            </Navbar>  
        </>
    )
}
