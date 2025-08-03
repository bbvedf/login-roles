const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AllowedEmail = require('../models/ApprovedEmail');

const JWT_SECRET = process.env.JWT_SECRET || 'mi_secreto';

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 1. Verifica si el usuario ya existe
    const userExists = await pool.query(
      'SELECT * FROM users WHERE email = $1', 
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // 2. Hash de la contraseña (usa bcrypt)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Crea el usuario en la base de datos
    const newUser = await pool.query(
      `INSERT INTO users (username, email, password, is_approved)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, username, is_approved AS "isApproved"`,
      [username, email, hashedPassword, false] // is_approved=false por defecto
    );

    // 4. Verifica si el email está en la lista de aprobados
    const approvedEmail = await pool.query(
      'SELECT role FROM approved_emails WHERE email = $1',
      [email]
    );

    const role = approvedEmail.rows[0]?.role || 'user';

    // 5. Genera el token JWT
    const token = jwt.sign(
      {
        userId: newUser.rows[0].id,
        email: newUser.rows[0].email,
        isApproved: newUser.rows[0].isApproved,
        role: role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // 6. Respuesta exitosa
    res.status(201).json({
      token,
      user: {
        id: newUser.rows[0].id,
        email: newUser.rows[0].email,
        username: newUser.rows[0].username,
        isApproved: newUser.rows[0].isApproved,
        role: role
      }
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
      `SELECT 
        u.id, 
        u.email, 
        u.username, 
        u.password,
        u.is_approved AS "isApproved",
        a.role
       FROM users u
       LEFT JOIN approved_emails a ON u.email = a.email
       WHERE u.email = $1`,
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Comparación de contraseña (adaptar según tu sistema)
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      {
        userId: user.rows[0].id,
        email: user.rows[0].email,
        isApproved: user.rows[0].isApproved,
        role: user.rows[0].role || 'user'  // Si no tiene role, asigna 'user'
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
        username: user.rows[0].username,  // Cambiado de name a username
        isApproved: user.rows[0].isApproved,
        role: user.rows[0].role || 'user'
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};


