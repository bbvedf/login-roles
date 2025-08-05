import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      // Manejo específico para usuarios no aprobados
      if (response.status === 403) {
        const data = await response.json();
        if (data.requiresApproval) {
          navigate('/welcome', {
            state: {
              email: data.email,
              username: data.userData?.username
            },
            replace: true
          });
          return;
        }
      }

      if (!response.ok) {
        throw new Error('Credenciales inválidas');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      navigate('/dashboard');

    } catch (error) {
      setError(error.message);
    }
  };


  return (
    <div className={styles.container}>
      <div className={styles.form}>

        <form onSubmit={handleSubmit}>
          <h2>Iniciar Sesión</h2>


          <div className={styles.inputGroup}>
            <label htmlFor="email">Correo</label>

            <input
              id="email"
              name="email"
              type="email"
              className={styles.input}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email"
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
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Contraseña"
              required
            />
          </div>
          <button type="submit" className={styles.button}>Entrar</button>
        </form>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.separator}>
          <span>o continúa con</span>
        </div>

        <div className={styles.googleButton}>
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                const response = await fetch('http://localhost:5000/api/auth/google', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ token: credentialResponse.credential }),
                });

                const data = await response.json();

                if (response.status === 403 && data.requiresApproval) {
                  navigate('/welcome', {
                    state: {
                      email: data.email,
                      username: data.userData?.username
                    },
                    replace: true
                  });
                  return;
                }

                if (!response.ok) {
                  throw new Error(data.error || 'Error al iniciar sesión con Google');
                }

                localStorage.setItem('token', data.token);
                navigate('/dashboard');
              } catch (error) {
                setError('Error al autenticar con Google');
              }
            }}
            onError={() => {
              setError('Error al autenticar con Google');
            }}
          />
        </div>

        <p className={styles.footer}>
          ¿No tienes cuenta? <a href="/register">Regístrate</a>
        </p>


      </div>
    </div>
  );
};

export default Login;




/* 
        <div className={styles.googleButton}>
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                const response = await fetch('http://localhost:5000/api/auth/google', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ token: credentialResponse.credential }),
                });
                const data = await response.json();
                if (response.ok) {
                  localStorage.setItem('token', data.token);
                  navigate(data.user.isApproved ? '/dashboard' : '/welcome');
                }
              } catch (error) {
                setError('Error al autenticar con Google');
              }
            }}
            onError={() => {
              setError('Error al autenticar con Google');
            }}
          />
        </div>

*/