import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, token, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div class="min-h-screen bg-[#0A0F1F] flex items-center justify-center">
        <div class="relative w-16 h-16">
          <div class="absolute inset-0 rounded-full border-4 border-cyan-500/20 border-t-cyan-500 animate-spin"></div>
          <div class="absolute inset-2 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin duration-1000"></div>
        </div>
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length && !allowedRoles.includes(user.role)) {
    // Redirect to landing if unauthorized for specific route
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
