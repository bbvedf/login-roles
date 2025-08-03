const express = require('express');
const { Router } = express; 
const router = Router();
const jwt = require('jsonwebtoken');
const pool = require('../db');
const AllowedEmail = require('../models/ApprovedEmail');

// Importa los controladores
const authController = require('../controllers/auth');
const googleAuthController = require('../controllers/googleAuth');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware'); 

// Rutas públicas
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/google-login', googleAuthController.handleGoogleLogin);


// Rutas protegidas
router.get('/verify', verifyToken, (req, res) => {
    console.log(req.user);
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


router.post('/logout', verifyToken, (req, res) => {
  res.json({ message: 'Sesión cerrada' });
});

// Rutas administrativas
router.post('/approved-emails', verifyToken, isAdmin, async (req, res) => {
  // ... (mantén tu implementación existente)
});

router.get('/approved-emails', verifyToken, isAdmin, async (req, res) => {
  // ... (mantén tu implementación existente)
});

module.exports = router;