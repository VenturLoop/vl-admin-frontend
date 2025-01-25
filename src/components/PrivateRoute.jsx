import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element }) => {
  const token = localStorage.getItem("authToken");

  // If the user is not authenticated, redirect them to the login page
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // If the user is authenticated, render the requested element (route)
  return element;
};

export default PrivateRoute;
