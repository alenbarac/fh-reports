import React from 'react';
import { useSanctum } from 'react-sanctum';
import { CButton } from '@coreui/react';

const LoginButton = () => {
  const { authenticated, user, signIn } = useSanctum();

  const handleLogin = () => {
    const email = 'alen@commer.com';
    const password = 'fhapi';
    const remember = true;

    signIn(email, password, remember)
      .then(() => window.alert('Signed in!'))
      .catch(() => window.alert('Incorrect email or password'));
  };

  if (authenticated === true) {
    return <h6>Welcome, {user.name}</h6>;
  } else {
    return (
      <CButton onClick={handleLogin} color="primary" variant="outline">
        Login
      </CButton>
    );
  }
};

export default LoginButton;
