import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import styles from './Register.module.css';

const API_URL = 'http://localhost:5000/api/auth';

function Register() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState({ text: '', isError: false });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage({ text: '', isError: false });

    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.msg || 'Error en el registro');
      }

      // Registro exitoso
      login(data.token, data.user);

      setMessage({
        text: '¡Registro exitoso! Redirigiendo...',
        isError: false
      });

      // Redirige según aprobación
      setTimeout(() => {
        navigate(data.user.isApproved ? '/dashboard' : '/welcome', {
          state: { email: data.user.email }
        });
      }, 1500);

    } catch (error) {
      setMessage({
        text: error.message.includes('Failed to fetch')
          ? 'Error de conexión con el servidor'
          : error.message,
        isError: true
      });
      console.error('Error en registro:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Registro</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Usuario"
          className={styles.input}
          value={form.username}
          onChange={handleChange}
          required
          minLength={3}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className={styles.input}
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          className={styles.input}
          value={form.password}
          onChange={handleChange}
          required
          minLength={6}
        />
        <button type="submit" className={styles.button}>
          Registrar
        </button>
      </form>

      {message.text && (
        <div className={message.isError ? styles.error : styles.success}>
          {message.text}
        </div>
      )}

      <Link to="/login" className={styles.link}>
        ¿Ya tienes cuenta? Inicia sesión aquí
      </Link>
    </div>
  );
}

export default Register;