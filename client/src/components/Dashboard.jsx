import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Dashboard() {
  const { logout } = useContext(AuthContext);

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>Bienvenido al Panel Privado</h2>
      <p>Esta ruta está protegida.</p>
      <button onClick={logout} style={{ padding: '10px 20px' }}>
        Cerrar sesión
      </button>
    </div>
  );
}

export default Dashboard;
