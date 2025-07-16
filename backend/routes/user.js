const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, async (req, res) => {
  const email = req.user.email;
  const [rows] = await pool.query('SELECT id, email, full_name, is_admin FROM users WHERE email = ?', [email]);
  if (rows.length === 0) return res.status(404).json({ error: 'Utilisateur non trouvé' });
  res.json(rows[0]);
});

router.put('/', authMiddleware, async (req, res) => {
  const { full_name } = req.body;
  const email = req.user.email;
  const [result] = await pool.query('UPDATE users SET full_name = ? WHERE email = ?', [full_name, email]);
  if (result.affectedRows === 0) return res.status(404).json({ error: 'Utilisateur non trouvé' });
  const [updated] = await pool.query('SELECT id, email, full_name, is_admin FROM users WHERE email = ?', [email]);
  res.json(updated[0]);
});

module.exports = router;
