import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import styles from './Login.module.css';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };
  
const handleResponse = (data) => {
  login(data.token, data.user); // Guarda en el contexto/auth
  if (data.user.isApproved) {
    navigate('/dashboard'); // Usuario aprobado
  } else {
    navigate('/welcome', { state: { email: data.user.email } });
  }
};


const handleError = (err) => {
  try {
    const errorData = JSON.parse(err.message);
    setError(errorData.message || 'Error desconocido');
  } catch {
    setError(err.message || 'Error de conexión');
  }
};

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    const data = await response.json();
    console.log("Respuesta del backend:", data);
    if (!response.ok) {
      throw new Error(JSON.stringify(data));
    }

    handleResponse(data);
  } catch (err) {
    handleError(err);
  }
};

  const handleGoogleSuccess = async (credentialResponse) => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/google-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential: credentialResponse.credential })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(JSON.stringify(data));
    }

    handleResponse(data);
  } catch (err) {
    handleError(err);
  }
};

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <h2>Iniciar Sesión</h2>

        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Correo</label>
            <input
              id="email"
              name="email"
              type="email"
              className={styles.input}
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              className={styles.input}
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className={styles.button}>
            Entrar
          </button>
        </form>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.separator}>
          <span>o continúa con</span>
        </div>

        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => setError('Error al iniciar con Google')}
        />

        <p className={styles.footer}>
          ¿No tienes cuenta? <a href="/register">Regístrate</a>
        </p>
      </div>
    </div>
  );
};

export default Login;