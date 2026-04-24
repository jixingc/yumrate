import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    // 将尝试访问的页面路径作为 state 传给 login，登录后可以跳回来
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
