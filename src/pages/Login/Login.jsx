import React from 'react';
import { useState, useEffect } from 'react';
import { useSanctum } from 'react-sanctum';
import { useForm } from "react-hook-form";
import { CCol, CButton, CCard, CCardBody, CCardTitle, CContainer, CForm, CFormLabel, CFormInput } from '@coreui/react';


import apiClient from '../../helpers/api';
import Dashboard from '../Admin/Dashboard';
import { Navigate } from 'react-router-dom';

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState("");

  const { authenticated, user, signIn } = useSanctum();
  const { register, formState: { errors }, reset, handleSubmit } = useForm();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (email, password) {
      setEmail((current) => email);
      setPassword((current) => password);

      await signIn(email, password, remember)
        .then(() => console.log('Signed in!'))
        .catch(() => console.log('Incorrect email or password'));
    }

    setEmail("");
    setPassword("");

  };


  if (authenticated === true) {
    return <Navigate to="/dashboard" />
  } else {
    return (

      <CContainer>
        <div className="login-wrapper">
          <CCard>
            <CCardBody>
              <CCardTitle>
                Login - Fishing Reports App
              </CCardTitle>
              <hr />
              <CForm
                className="waterbody-create row g-3 needs-validation"
                onSubmit={handleLogin}
              >
                <CCol md={12}>
                  <CFormLabel htmlFor="userName" >
                    Your Email
                  </CFormLabel>
                  <CFormInput
                    type="email"
                    id="userName"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}

                  />

                </CCol>
                <CCol md={12}>
                  <CFormLabel htmlFor="posterName" >
                    Your Password
                  </CFormLabel>
                  <CFormInput
                    type="password"
                    id="userPassword"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                </CCol>
                <CCol xs={12}>
                  <CButton color="secondary" type="submit" className='mt-4'>
                    Login
                  </CButton>
                </CCol>
              </CForm>
            </CCardBody>
          </CCard>
        </div>
      </CContainer>
    );
  }


}

export default Login