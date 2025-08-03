const jwt = require('jsonwebtoken');
const pool = require('../db');

exports.verifyToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token requerido' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Verificamos datos básicos del usuario
        const user = await pool.query(
            `SELECT 
        id, 
        email, 
        is_approved AS "isApproved"
       FROM users WHERE id = $1`,
            [decoded.userId]
        );

        if (user.rows.length === 0) {
            return res.status(401).json({ error: 'Usuario no existe' });
        }

        // Obtenemos el role (si existe)
        const approvedEmail = await pool.query(
            'SELECT role FROM approved_emails WHERE email = $1',
            [decoded.email]
        );

        req.user = {
            ...decoded,
            role: approvedEmail.rows[0]?.role || 'user'  // Role por defecto
        };

        next();
    } catch (err) {
        console.error('Error en verifyToken:', err);
        res.status(403).json({ error: 'Token inválido' });
    }
};

exports.checkApproved = async (req, res, next) => {
    try {
        const user = await pool.query(
            'SELECT is_approved FROM users WHERE email = $1',
            [req.user.email]
        );

        if (!user.rows[0]?.is_approved) {
            return res.status(403).json({
                error: 'pending_approval',
                message: 'Contacta a pepito@gmail.com para acceso completo'
            });
        }
        next();
    } catch (err) {
        res.status(500).json({ error: 'Error al verificar aprobación' });
    }
};

exports.isAdmin = async (req, res, next) => {
    // Implementación opcional si luego necesitas admins
    next();
};