// src/middleware/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { isLoggedIn, removeToken } from '../utils/tokenHelper.js';
import { logoutUser } from '../store/authSlice.js';

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const loggedInRedux = auth?.isAuthenticated;
  const loggedInToken = isLoggedIn(); // checks token & expiry

  // If not logged in OR token expired
  if (!loggedInRedux || !loggedInToken) {
    // Remove token from storage
    removeToken();
    // Clear Redux state
    dispatch(logoutUser());
    // Redirect to login
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
