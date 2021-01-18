import React from 'react';
import Dashboard from '../Dashboard'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import { GoogleLogin } from 'react-google-login';
// refresh token
import { refreshTokenSetup } from '../utils/refreshToken';

const clientId =
  '628527638852-jv08cufh46kjretiuvb70n4cmrdptfr1.apps.googleusercontent.com';

function Login() {
  const onSuccess = (res) => {
    console.log('Login Success: currentUser:', res.profileObj);
    let answser = alert(
      `Logged in successfully welcome ${res.profileObj.name} 😍. \n`
    );
    if (answser) {
      window.location="http://localhost:3000/dashboard";
    }
    //refreshTokenSetup(res);
  };

  const onFailure = (res) => {
    console.log('Login failed: res:', res);
    alert(
      `Failed to login 😢`
    );
  };

  return (
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
  );
}

export default Login;