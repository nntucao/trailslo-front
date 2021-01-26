import React from 'react';
import { useGoogleLogout } from 'react-google-login';

const clientId =
    '628527638852-jv08cufh46kjretiuvb70n4cmrdptfr1.apps.googleusercontent.com';

export default function Logout() {
    const onLogoutSuccess = (res) => {
        console.log('Logged out Success');
        alert('Logged out Successfully ✌');
    };

    const onFailure = () => {
        console.log('Handle failure cases');
    };

    const { signOut } = useGoogleLogout({
        clientId,
        onLogoutSuccess,
        onFailure,
    });

    return (
        <button onClick={signOut} className="button">
            <img src="icons/google.svg" alt="google login" className="icon"></img>

            <span className="buttonText">Sign out</span>
        </button>
    );
}