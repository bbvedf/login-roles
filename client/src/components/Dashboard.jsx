import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import styles from './Dashboard.module.css';

function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (!user.isApproved) {
      // Solo redirige si NO estamos ya en /welcome
      if (window.location.pathname !== '/welcome') {
        navigate('/welcome', { state: { email: user.email } });
      }
    }
  }, [user, navigate]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Bienvenido al Dashboard, {user.name || user.email}</h2>
      <div className={styles.userInfo}>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Estado:</strong> {user.isApproved ? 'Verificado' : 'Pendiente'}</p>
      </div>
      <button
        onClick={logout}
        className={styles.logoutButton}
      >
        Cerrar Sesión
      </button>
    </div>
  );
}

export default Dashboard;


