// src/components/common/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../../utils/auth';

const ProtectedRoute = () => {
  // 1. Verifica si hay un token
  if (!isAuthenticated()) {
    // Si no hay token, redirige a la página de inicio de sesión
    return <Navigate to="/login" replace />;
  }

  // 2. Si hay token, renderiza los componentes hijos (las rutas protegidas)
  return <Outlet />;
};

export default ProtectedRoute;