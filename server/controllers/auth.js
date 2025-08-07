// Lógica de negocio: qué sucede cuando alguien se registra, inicia sesión, etc.

const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendNewUserNotificationEmail } = require('../utils/emailSender');
const { OAuth2Client } = require('google-auth-library');

const JWT_SECRET = process.env.JWT_SECRET || 'mi_secreto';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'TU_CLIENT_ID';
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

// Generar token JWT
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
      isApproved: user.isApproved
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
};

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userExists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      `INSERT INTO users (username, email, password, is_approved, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, username, is_approved AS "isApproved", role`,
      [username, email, hashedPassword, false, 'basic']
    );

    await sendNewUserNotificationEmail({ username, email });

    res.status(201).json({
      message: 'Registro exitoso. Espera aprobación.',
      email: newUser.rows[0].email,
      username: newUser.rows[0].username,
      requiresApproval: true
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query(
      `SELECT id, email, username, password, is_approved AS "isApproved", role
       FROM users WHERE email = $1`,
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    if (!user.rows[0].isApproved) {
      return res.status(403).json({
        requiresApproval: true,
        email: user.rows[0].email,
        message: 'Cuenta pendiente de aprobación'
      });
    }

    const token = generateToken(user.rows[0]);

    res.json({
      success: true,
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
};

exports.googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.name || email.split('@')[0];

    let userResult = await pool.query(
      `SELECT id, email, username, is_approved AS "isApproved", role 
       FROM users WHERE email = $1`,
      [email]
    );

    let user;

    if (userResult.rows.length === 0) {
      const insertResult = await pool.query(
        `INSERT INTO users (username, email, password, role, is_approved)
         VALUES ($1, $2, '', 'basic', false)
         RETURNING id, email, username, is_approved AS "isApproved", role`,
        [name, email]
      );

      user = insertResult.rows[0];
      await sendNewUserNotificationEmail({ username: name, email });
    } else {
      user = userResult.rows[0];
    }

    if (!user.isApproved) {
      return res.status(403).json({
        requiresApproval: true,
        email: user.email,
        userData: {
          email: user.email,
          username: user.username
        },
        message: 'Cuenta pendiente de aprobación'
      });
    }

    const jwtToken = generateToken(user);

    res.json({
      success: true,
      token: jwtToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error en login con Google:', error);
    res.status(401).json({ error: 'Token de Google inválido' });
  }
};
