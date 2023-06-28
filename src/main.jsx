import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// Importing Sass with Bootstrap CSS
import './App.scss';

import { Sanctum } from 'react-sanctum';

const sanctumConfig = {
  apiUrl: `${import.meta.env.VITE_API_URL}`,
  csrfCookieRoute: 'csrf-cookie',
  signInRoute: 'login',
  signOutRoute: 'logout',
  userObjectRoute: 'user',
};

ReactDOM.render(

  <Sanctum config={sanctumConfig}>
    <App />
  </Sanctum>
  ,
  document.getElementById('root')
);
