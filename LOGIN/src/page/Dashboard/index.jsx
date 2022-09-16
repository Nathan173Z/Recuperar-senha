import React from "react";
import { Container } from 'react-bootstrap';
import { NavBar } from '../../components/UI/NavBar/NavBar'

export const Dashboard = () =>{
   
    return(
        <>
            <NavBar />
            <Container>
                <h1>VOCÊ ESTA LOGADO</h1>
            </Container>
        </>
    )
}
