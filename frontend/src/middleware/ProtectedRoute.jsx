// src/middleware/ProtectedRoute.jsx
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { isLoggedIn, removeToken } from '../utils/tokenHelper.js'
import { logoutUser } from '../store/authSlice.js' // optional if you want Redux logout

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch()
  const auth = useSelector((state) => state.auth)
  const loggedInRedux = auth?.isAuthenticated
  const loggedInToken = isLoggedIn() // checks token & expiry

  if (!loggedInRedux && !loggedInToken) {
    // Auto-logout Redux + localStorage if token expired
    removeToken()
    if (loggedInRedux) dispatch(logoutUser())

    // Redirect to login
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
