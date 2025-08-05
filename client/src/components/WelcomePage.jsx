// client/src/components/WelcomePage.jsx
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './WelcomePage.module.css';

export default function WelcomePage() {
  const location = useLocation();
  const { logout, user } = useAuth(); // <-- Añade user del contexto
  
  // Prefiere el email del contexto (si existe) sobre el location.state
  const email = user?.email || location.state?.email || 'tu correo';

    return (
    <div className={styles.container}>
      <h1>¡Registro Completado!</h1>
      <p className={styles.message}>
        Tu cuenta <strong>{email}</strong> está pendiente de verificación.
      </p>
      <p className={styles.instructions}>
        Para acceder al sistema completo, contacta a:
        <br />
        <a href="mailto:pepito@gmail.com" className={styles.contactLink}>
          pepito@gmail.com
        </a>
      </p>
      <div className={styles.note}>
        <p>Recibirás un email cuando tu cuenta haya sido aprobada.</p>
      </div>
      
      {/* Botón de Cerrar Sesión */}
      <button 
        onClick={logout} 
        className={styles.logoutButton} // Añade estilos en tu CSS module
      >
        Cerrar Sesión
      </button>
    </div>
  );
}