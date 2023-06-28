import React, { useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useSanctum } from 'react-sanctum';

const ProtectedRoutes = () => {
  const { authenticated, user, signIn } = useSanctum();

  return (
    authenticated ? <Outlet /> : <Navigate to='/login' />
  )
}


export default ProtectedRoutes