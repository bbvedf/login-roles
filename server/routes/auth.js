const express = require('express');
const { Router } = express;
const router = Router();
const jwt = require('jsonwebtoken');
const pool = require('../db');
const bcrypt = require('bcryptjs');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const authController = require('../controllers/auth');


// Helper para generar tokens
const generateToken = (user) => {
    return jwt.sign(
        {
            userId: user.id,
            email: user.email,
            role: user.role,
            isApproved: user.is_approved
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

// Registro de usuario
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 1. Verificar si el usuario ya existe
        const userExists = await pool.query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        );

        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        // 2. Crear usuario (con role 'basic' por defecto)
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await pool.query(
            `INSERT INTO users (username, email, password, role)
       VALUES ($1, $2, $3, 'basic')
       RETURNING id, email, username, is_approved AS "isApproved", role`,
            [username, email, hashedPassword]
        );

        // 3. Respuesta exitosa (sin token de acceso hasta aprobación)
        res.status(201).json({
            message: 'Registro exitoso. Espera aprobación.',
            user: newUser.rows[0]
        });

    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Login de usuario
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Buscar usuario
        const user = await pool.query(
            `SELECT 
        id, 
        email, 
        username, 
        password,
        is_approved AS "isApproved",
        role
       FROM users 
       WHERE email = $1`,
            [email]
        );

        if (user.rows.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // 2. Verificar contraseña
        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // 3. Verificar aprobación
        if (!user.rows[0].isApproved) {
            return res.status(403).json({
                success: false,  // <- Nuevo campo
                message: 'Cuenta pendiente de aprobación',
                requiresApproval: true,
                email: user.rows[0].email,
                userData: {  // <- Datos útiles para el frontend
                    email: user.rows[0].email,
                    username: user.rows[0].username
                }
            });
        }

        // 4. Generar token para usuario aprobado
        const token = generateToken(user.rows[0]);

        res.json({
            token,
            user: {
                id: user.rows[0].id,
                email: user.rows[0].email,
                username: user.rows[0].username,
                role: user.rows[0].role
            }
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Verificación de token
router.get('/verify', verifyToken, (req, res) => {
    res.json({
        valid: true,
        user: {
            id: req.user.userId,
            email: req.user.email,
            role: req.user.role,
            isApproved: req.user.isApproved
        }
    });
});

// Logout
router.post('/logout', verifyToken, (req, res) => {
    res.json({ message: 'Sesión cerrada' });
});


// Logging con google
router.post('/google', authController.googleLogin);


// Recuperación de contraseña (placeholder)
router.post('/reset-password', async (req, res) => {
  const { email } = req.body;

  try {
    // Simulación: buscar usuario
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Simulación: generar token
    const resetToken = jwt.sign(
      { userId: user.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    // Simular envío por email (por ahora solo mostrar en consola)
    console.log(`Enlace de recuperación para ${email}: http://localhost:3000/new-password/${resetToken}`);

    res.json({ message: 'Se ha enviado un enlace de recuperación a tu correo (simulado).' });
  } catch (err) {
    console.error('Error en /resetpassword:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.post('/new-password', async (req, res) => {
  const { token, password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Hash de la nueva contraseña
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'UPDATE users SET password = $1 WHERE id = $2',
      [hashedPassword, decoded.userId]
    );

    res.json({ message: 'Contraseña actualizada' });
  } catch (err) {
    console.error('Error en /new-password:', err);
    res.status(400).json({ error: 'Token inválido o expirado' });
  }
});


module.exports = router;