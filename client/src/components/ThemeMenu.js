import { useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import styles from './ThemeMenu.module.css';
import { FiSun, FiMoon, FiLogOut } from 'react-icons/fi';

const ThemeMenu = ({ theme, setTheme, onLogout }) => {
    const { user, logout } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={styles.menuContainer}>
            <button
                className={styles.hamburgerButton}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Menú"
            >
                <span className={styles.hamburgerLine}></span>
                <span className={styles.hamburgerLine}></span>
                <span className={styles.hamburgerLine}></span>
            </button>

            {isOpen && (
                <div className={styles.menuDropdown}>
                    <button
                        className={styles.menuItem} onClick={() => {
                            setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
                            setIsOpen(false);
                        }}
                    >
                        {theme === 'light' ? (
                            <>
                                <FiMoon size={16} className={styles.icon} /> Modo Oscuro
                            </>
                        ) : (
                            <>
                                <FiSun size={16} className={styles.icon} /> Modo Claro
                            </>
                        )}
                    </button>

                    {user && ( // Mostrar sólo si hay usuario logueado
                        <button className={styles.menuItem} onClick={() => {
                            logout();
                            setIsOpen(false);
                        }}>
                            <FiLogOut className={styles.icon} />
                            Cerrar Sesión
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default ThemeMenu;