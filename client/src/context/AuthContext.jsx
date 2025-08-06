import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../src/config';

// 1. Añade error al contexto
export const AuthContext = createContext({
  user: null,
  isLoggedIn: false,
  loading: true,
  error: null,         // Nuevo estado para errores
  setError: () => { },  // Función para actualizar errores
  login: () => { },
  logout: () => { },
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // 2. Estado para errores
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const { user } = await response.json();
          setUser(user);
          setIsLoggedIn(true);
          if (user?.isApproved) {
            navigate('/dashboard');
          } else {
            navigate('/welcome');
          }
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        setError("Error al verificar autenticación"); // 3. Manejo de errores
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [navigate]);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403 && data.requiresApproval) {
          // Redirige PRIMERO antes de hacer return
          navigate('/welcome', {
            state: { email: data.email || email },
            replace: true
          });
          return { requiresApproval: true }; // Return especial
        }
        throw new Error(data.error || 'Error en login');
      }

      localStorage.setItem('token', data.token);
      setUser(data.user);
      navigate(data.user.isApproved ? '/dashboard' : '/welcome');
      return data;

    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    const token = localStorage.getItem('token');

    try {
      if (token) {
        await fetch(`${API_BASE_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.warn('Logout falló (pero continuamos):', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setIsLoggedIn(false);
      setError(null);
      navigate('/login');
    }
  };


  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn,
      loading,
      error,      // 7. Expón el estado de error
      setError,   // 8. Expón la función para actualizarlo
      login,
      logout
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};