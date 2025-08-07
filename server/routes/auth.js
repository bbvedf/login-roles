// Rutas del backend: qué URL existe y a qué función del controller llama

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const { verifyToken } = require('../middleware/authMiddleware');
const { sendPasswordResetEmail } = require('../utils/emailSender');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const bcrypt = require('bcryptjs');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Registro y login
router.post('/register', authController.register);
router.post('/login', authController.login);

// Login con Google
router.post('/google', authController.googleLogin);

// Verificar token
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

// Enviar enlace de recuperación de contraseña
router.post('/reset-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const resetToken = jwt.sign(
      { userId: user.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const resetLink = `${FRONTEND_URL}/new-password/${resetToken}`;
    await sendPasswordResetEmail(email, resetLink);

    return res.json({ message: 'Enlace enviado al correo' });
  } catch (error) {
    console.error('Error en /reset-password:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Establecer nueva contraseña
router.post('/new-password', async (req, res) => {
  const { token, password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
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
