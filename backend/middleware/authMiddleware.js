const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token manquant' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Token invalide' });

    req.user = decoded; // ✅ decoded contient email et userId
    console.log('✅ Utilisateur authentifié :', decoded); // Pour test
    next();
  });
}

module.exports = authMiddleware;
