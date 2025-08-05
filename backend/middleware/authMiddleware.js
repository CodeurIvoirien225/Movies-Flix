const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token manquant ou invalide' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ⚠️ On ne garde que les infos minimales du token
    req.user = {
      id: decoded.id,
      email: decoded.email,
      is_admin: decoded.is_admin
      // ⚠️ PAS de is_subscribed ici, on ira le chercher dans la BDD
    };

    console.log("✅ Utilisateur authentifié :", req.user);
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalide' });
  }
};
