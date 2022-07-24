import React from 'react';
import { useScript } from '../hooks/useScript';
import jwt_decode from 'jwt-decode';

const OAuth = () => {
  const onSuccessfulLogin = response => {
    const encodedToken = response.credential;

    if (!encodedToken) return console.log('sum ting wong');

    const decodedToken = jwt_decode(encodedToken);
    console.log('decoded JWT ID token: ', decodedToken);
  };

  useScript('https://accounts.google.com/gsi/client', () => {
    window.google.accounts.id.initialize({
      client_id: process.env.REACT_APP_OAUTH_CLIENT_ID,
      callback: onSuccessfulLogin,
      auto_select: false,
    });

    window.google.accounts.id.renderButton(
      document.getElementById('googleSignIn'),
      { text: 'continue_with', shape: 'pill' }
    );
  });
  return <div id="googleSignIn"></div>;
};

export default OAuth;
