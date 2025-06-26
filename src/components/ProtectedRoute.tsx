import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Redirect to login page if no token is found
      navigate('/login', {
        replace: true, // Replace the current entry in the history stack
        state: {
          loginRequiredMessage: 'Anda harus login terlebih dahulu untuk mengakses halaman ini.',
          from: location.pathname, // Pass the current path to redirect back after login
        },
      });
    }
  }, [navigate, location.pathname]);

  // If there's no token, return null (or a loading spinner)
  // The useEffect hook will handle the redirection.
  if (!localStorage.getItem('token')) {
    return null;
  }

  // If a token exists, render the children components
  return <>{children}</>;
};

export default ProtectedRoute;
