import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import styles from './Dashboard.module.css';


function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('inicio');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (!user.isApproved) {
      if (window.location.pathname !== '/welcome') {
        navigate('/welcome', { state: { email: user.email } });
      }
    }
  }, [user, navigate]);

  useEffect(() => {
    if (activeTab === 'configuracion' && user?.role === 'admin') {
      fetchUsers();
    }
  }, [activeTab, user?.role]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Añade este console.log para debuggear:
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Users data:', data); // Verifica que llegan datos

      if (!response.ok) throw new Error(data.error || 'Error al cargar usuarios');
      setUsers(data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      // Muestra un mensaje de error en la UI si lo prefieres
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (action, userId, data = null) => {
    try {
      const fetchOptions = {
        method: action === 'delete' ? 'DELETE' : 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      };

      // Solo incluye el Content-Type y el body si no es DELETE
      if (action !== 'delete') {
        fetchOptions.headers['Content-Type'] = 'application/json';
        fetchOptions.body = JSON.stringify(data);
      }

      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, fetchOptions);

      if (response.ok) {
        fetchUsers();
      } else {
        const errorData = await response.json();
        console.error('Error del servidor:', errorData);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        await handleUserAction('delete', userToDelete.id);
        setShowDeleteModal(false);
        setUserToDelete(null);
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
      }
    }
  };


  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Panel de Administración</h2>
        <button onClick={logout} className={styles.logoutButton}>
          Cerrar Sesión
        </button>
        {showDeleteModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h3>Confirmar Eliminación</h3>
              <p>
                ¿Estás seguro de querer eliminar al usuario
                <strong> {userToDelete?.email}</strong>?
              </p>
              <div className={styles.modalButtons}>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className={styles.cancelButton}
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete} // Cambia de handleDeleteClick(user) a confirmDelete
                  className={styles.deleteButton}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <nav className={styles.navTabs}>
        <button
          className={`${styles.tabButton} ${activeTab === 'inicio' ? styles.active : ''}`}
          onClick={() => setActiveTab('inicio')}
        >
          Inicio
        </button>
        {user?.role === 'admin' && (
          <button
            className={`${styles.tabButton} ${activeTab === 'configuracion' ? styles.active : ''}`}
            onClick={() => setActiveTab('configuracion')}
          >
            Configuración
          </button>
        )}
      </nav>

      <div className={styles.tabContent}>
        {activeTab === 'inicio' ? (
          <div className={styles.welcomeSection}>
            <h3>Bienvenido, {user?.name || user?.email}</h3>
            <div className={styles.userInfo}>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Rol:</strong> {user?.role}</p>
              <p><strong>Aprobado:</strong> {user?.isApproved ? 'Verificado' : 'Pendiente'}</p>
            </div>
          </div>
        ) : (
          <div className={styles.adminPanel}>
            {loading ? (
              <p>Cargando usuarios...</p>
            ) : (
              <>
                <h3>Gestión de Usuarios</h3>
                <div className={styles.userTableContainer}>
                  <table className={styles.userTable}>
                    <thead>
                      <tr>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Aprobado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td>{user.email}</td>
                          <td>
                            <div className={styles.roleSelectContainer}>
                              <select
                                value={user.role}
                                onChange={(e) => handleUserAction('update', user.id, { role: e.target.value })}
                                className={styles.roleSelect}
                              >
                                <option value="admin">Admin</option>
                                <option value="basic">Básico</option>
                              </select>
                            </div>
                          </td>
                          <td>
                            <label className={styles.switch}>
                              <input
                                type="checkbox"
                                checked={user.isApproved || false}
                                onChange={(e) => handleUserAction('update', user.id, {
                                  isApproved: e.target.checked,
                                  role: user.role || 'basic'  // <-- Asegura que siempre se envía un rol
                                })}
                              />
                              <span className={styles.slider}></span>
                            </label>
                          </td>
                          <td>
                            <button
                              onClick={() => handleDeleteClick(user)}
                              className={styles.deleteButton}
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;