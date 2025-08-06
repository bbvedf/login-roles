import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import styles from './NewPassword.module.css';
import { API_BASE_URL } from '../config';

export default function NewPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (password !== confirm) {
            return setError('Las contraseñas no coinciden');
        }

        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/new-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password })
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Error al cambiar la contraseña');

            setMessage('Contraseña actualizada correctamente. Redirigiendo...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <h2>Establecer nueva contraseña</h2>

                <div className={styles.inputGroup}>
                    <label>Nueva contraseña</label>
                    <input
                        type="password"
                        placeholder="Nueva contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={styles.input}
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label>Confirmar contraseña</label>
                    <input
                        type="password"
                        placeholder="Confirmar contraseña"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        required
                        className={styles.input}
                    />
                </div>

                <button type="submit" className={styles.button}>Actualizar contraseña</button>

                {message && <p className={styles.success}>{message}</p>}
                {error && <p className={styles.error}>{error}</p>}
            </form>
        </div>
    );
}
