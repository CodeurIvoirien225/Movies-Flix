const pool = require('../db');

async function verifyPayment(req, res, next) {
  try {
    const decoded = req.user; // authMiddleware a déjà décodé le token

    const [rows] = await pool.query('SELECT has_paid FROM users WHERE id = ?', [decoded.id]);
    const user = rows[0];

    if (!user || !user.has_paid) {
      return res.status(403).json({ message: 'Paiement requis pour accéder aux films' });
    }

    next();
  } catch (err) {
    console.error(err);
    return res.status(403).json({ message: 'Accès interdit' });
  }
}

module.exports = verifyPayment;
