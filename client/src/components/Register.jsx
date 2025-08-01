import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api/auth';

function Register() {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        login(data.token);
        setMessage(`¡Registro exitoso! Token: ${data.token.substring(0, 20)}...`);
      } else {
        setMessage(data.msg || 'Error en registro');
      }
    } catch (error) {
      setMessage('Error de conexión');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Usuario"
          value={form.username}
          onChange={handleChange}
          required
          style={{ width: '100%', marginBottom: 10 }}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={{ width: '100%', marginBottom: 10 }}
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          required
          style={{ width: '100%', marginBottom: 10 }}
        />
        <button type="submit" style={{ width: '100%', padding: 10 }}>
          Registrar
        </button>
      </form>

      {message && <div style={{ marginTop: 10, color: 'red' }}>{message}</div>}

      <p style={{ marginTop: 20 }}>
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" style={{ color: 'blue', textDecoration: 'underline' }}>
          Inicia sesión aquí
        </Link>
      </p>
    </div>
  );
}

export default Register;
