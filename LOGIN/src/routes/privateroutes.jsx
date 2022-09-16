import React, { useContext } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { Context } from '../Context/AuthContext';

import { Login } from '../components/Login/Login';
import { Dashboard } from '../page/Dashboard';
import { forgotpassword } from '../page/ForgotPassword/ForgotPassword';
import { UpdatePassword } from '../page/recoverypassword/recoverypassword';

function CustomRoute({ isPrivate, ...rest}){

    const { authenticated } = useContext(Context);
    if( isPrivate && !authenticated){
        return <Redirect to="/" />
    }
    return <Route { ...rest } />

}

export default function PrivateRoute(){
    return (
        <Switch>
            <CustomRoute exact path="/" component={Login} />
            <CustomRoute  path="/dashboard" component={Dashboard} />
            <CustomRoute  path="/forgotpassword" component={ forgotpassword } />
            <CustomRoute path="/recoverypassword" component={UpdatePassword} />
        </Switch>
    )
}