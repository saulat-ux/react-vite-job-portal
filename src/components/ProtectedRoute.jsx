// src/components/ProtectedRoute.jsx

import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const authToken = localStorage.getItem("authToken");

  // If the user is not authenticated, redirect to the sign-in page
  return authToken ? children : <Navigate to="/signin" />;
};

export default ProtectedRoute;
