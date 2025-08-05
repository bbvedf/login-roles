const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const AllowedEmail = require('../models/ApprovedEmail');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const handleGoogleLogin = async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({
      error: 'missing_credential',
      message: 'Token de Google no proporcionado'
    });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
      issuer: ['https://accounts.google.com']
    });

    const { email_verified, email, name } = ticket.getPayload();
    
    if (!email_verified) {
      return res.status(403).json({
        error: 'unverified_email',
        message: 'Email de Google no verificado'
      });
    }

    const user = await pool.query(
      `INSERT INTO users (email, name, auth_method, is_approved) 
       VALUES ($1, $2, 'google', FALSE)
       ON CONFLICT (email) DO UPDATE 
       SET last_login = NOW()
       RETURNING id, email, name, is_approved`,
      [email, name]
    );

    const token = jwt.sign(
      { 
        userId: user.rows[0].id,
        email: user.rows[0].email,
        isApproved: user.rows[0].is_approved
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.rows[0].id,
        email: user.rows[0].email,
        name: user.rows[0].name,
        isApproved: user.rows[0].is_approved
      }
    });

  } catch (err) {
    console.error('Error en Google Auth:', err);
    res.status(500).json({
      error: 'google_auth_error',
      message: 'Error en autenticación con Google',
      details: err.message
    });
  }
};

module.exports = { handleGoogleLogin };