// src/middleware/RoleRoute.jsx
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { isLoggedIn, removeToken } from '../utils/tokenHelper.js'
import { logoutUser } from '../store/authSlice.js'

const RoleRoute = ({ children, allowedRoles = [] }) => {
  const dispatch = useDispatch()
  const auth = useSelector((state) => state.auth)
  const user = auth?.user
  const loggedIn = auth?.isAuthenticated || isLoggedIn()

  if (!loggedIn) {
    removeToken()
    if (auth?.isAuthenticated) dispatch(logoutUser())
    return <Navigate to="/login" replace />
  }

  if (allowedRoles.length && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace /> // unauthorized
  }

  return children
}

export default RoleRoute
