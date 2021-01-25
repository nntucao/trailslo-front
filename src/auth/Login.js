import React, { useContext, useState } from 'react';
import axios from 'axios';
import Dashboard from '../Dashboard'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { GoogleLogin } from 'react-google-login';
import { refreshTokenSetup } from '../utils/refreshToken';
import storeAPI from '../utils/storeAPI';
import { Button } from '@material-ui/core/';

const clientId =
  '628527638852-jv08cufh46kjretiuvb70n4cmrdptfr1.apps.googleusercontent.com';

export default function Login() {
  const onSuccess = (res) => {
    console.log('Login Success: currentUser:', res.profileObj);
    alert(
      `Logged in successfully welcome ${res.profileObj.name} 😍. \n`
    );
    var storedEmailsData = JSON.parse(localStorage["idEmailsDicData"]);
    if (Object.values(storedEmailsData).includes(res.profileObj.email)) {
      const idUser = Object.keys(storedEmailsData).find(key => storedEmailsData[key] === res.profileObj.email);
      retrieveUser(idUser); 
    } else {
      //createUser();
    }
    
    refreshTokenSetup(res);
  };

  const onFailure = (res) => {
    console.log('Login failed: res:', res);
    alert(
      `Failed to login 😢`
    );
  };

  const retrieveUser = async (idUser) => {
    console.log('start retrieving user: ', idUser);
    await axios.get(`http://localhost:3001/api/v1/users/${idUser}`)
      .then((resp) => {
          const user =
          {
              id: resp.data.id,
              email: resp.data.email,
              googleId: resp.data.googleId
          }
          console.log('user retrieved: ', user);
      })
      .catch(err => {
        console.error('error ' + err);
      });
  };
  
  return (
    <div>
      <div>
        <GoogleLogin
          clientId={clientId}
          buttonText="Login"
          onSuccess={onSuccess}
          onFailure={onFailure}
          cookiePolicy={'single_host_origin'}
          style={{ marginTop: '100px' }}
          isSignedIn={true}
        />
      </div>
    </div>
  );
}

