import React from "react";
import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../utils/tokenHelper.js";

const ProtectedRoute = ({ children }) => {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
