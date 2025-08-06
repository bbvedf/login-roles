import { useState } from 'react';
import styles from './ResetPassword.module.css';

export default function ResetPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch('http://localhost:5000/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Algo salió mal');

            setMessage(data.message || 'Revisa tu correo para instrucciones de recuperación.');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <h2>Restablecer contraseña</h2>

                <div className={styles.inputGroup}>
                    <label>Email</label>
                    <input
                        type="email"
                        required
                        placeholder="Tu correo registrado"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={styles.input}
                    />
                </div>

                <button type="submit" className={styles.button}>Enviar enlace</button>

                {message && <p className={styles.success}>{message}</p>}
                {error && <p className={styles.error}>{error}</p>}
            </form>
        </div>
    );
}
