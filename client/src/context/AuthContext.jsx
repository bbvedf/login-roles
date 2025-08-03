import React, { createContext, useContext , useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // ¡Nuevo estado!
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/auth/verify', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const { user } = await response.json();
          setUser(user);
          setIsLoggedIn(true);
          // Añade esta condición para redirigir según isApproved:
          if (user?.isApproved) {
            navigate('/dashboard');
          } else {
            navigate('/welcome');
          }
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error("Auth verification failed:", error);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [navigate]); // Añade navigate como dependencia


  const login = async (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);
    setIsLoggedIn(true); // ¡Añade esto!
  };

  const logout = async () => {
    try {
      await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setIsLoggedIn(false); // ¡Añade esto!
      navigate('/login');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn, // ¡Expón este valor!
      loading,
      login,
      logout
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};