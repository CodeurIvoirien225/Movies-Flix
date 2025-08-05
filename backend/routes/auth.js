const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');


// Inscription
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(400).json({ message: 'Email déjà utilisé' });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Ajout de is_subscribed avec valeur par défaut 0
    const [result] = await pool.query(
      'INSERT INTO users (email, password, is_subscribed) VALUES (?, ?, 0)', 
      [email, hashedPassword]
    );

    const user = { 
      id: result.insertId, 
      email, 
      is_admin: false,
      is_subscribed: 0 // Valeur par défaut
    };

    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});



// Connexion
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];

    if (!user) return res.status(401).json({ message: 'Email incorrect' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ message: 'Mot de passe incorrect' });

    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        is_admin: user.is_admin,
        is_subscribed: user.is_subscribed // Ajout de ce champ
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        is_admin: user.is_admin,
        is_subscribed: user.is_subscribed // Ajout de ce champ
      } 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});



// Profil
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    // Ajout de is_subscribed dans la requête
    const [rows] = await pool.query(
      'SELECT id, email, full_name, is_admin, is_subscribed FROM users WHERE id = ?', 
      [req.user.id]
    );
    const user = rows[0];
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;