// src/middleware/RoleRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { isLoggedIn, removeToken } from '../utils/tokenHelper.js';
import { logoutUser } from '../store/authSlice.js';

const RoleRoute = ({ children, role }) => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const user = auth?.user;
  const loggedIn = auth?.isAuthenticated || isLoggedIn();

  // 1️⃣ If not logged in
  if (!loggedIn) {
    removeToken();
    if (auth?.isAuthenticated) dispatch(logoutUser());
    return <Navigate to="/login" replace />;
  }

  // 2️⃣ If user is not admin
  if (role && user?.role !== role) {
    return <Navigate to="/" replace />;
  }

  // 3️⃣ If user role matches
  return children;
};

export default RoleRoute;
