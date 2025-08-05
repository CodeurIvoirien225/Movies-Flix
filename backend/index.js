// index.js

// --- Importations des modules ---
const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Pour charger les variables d'environnement
const path = require('path');
const fs = require('fs');
const multer = require('multer'); // Pour la gestion des fichiers
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');





const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  },
  tls: process.env.NODE_ENV === 'production' ? {} : { rejectUnauthorized: false }
});



// Importation des routeurs
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const movieRoutes = require('./routes/movies'); // Note: moviesRouter est le même, on peut utiliser movieRoutes
const pool = require('./db'); // Assurez-vous que votre fichier db.js exporte 'pool'
const authMiddleware = require('./middleware/authMiddleware');
const verifyPayment = require('./middleware/verifyPayment');




// --- Initialisation de l'application Express ---
const app = express();

// --- Configuration du dossier 'uploads' ---
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// --- Configuration de Multer pour les téléchargements de fichiers ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// --- Middlewares globaux ---

// Middleware de log universel (pour le débogage, à placer en premier)
app.use((req, res, next) => {
  console.log(`[LOG_REQUETE] ${req.method} ${req.originalUrl}`);
  next();
});

// Servir les fichiers statiques depuis le dossier 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Activation de CORS (Cross-Origin Resource Sharing)
// Pour une configuration plus sécurisée en production, vous pourriez spécifier 'origin'
app.use(cors());


const webhookRoute = require('./webhook');
app.use('/webhook', webhookRoute);

// Parser le corps des requêtes en JSON
app.use(express.json());

// --- Définition des Routes API ---

// Routes d'authentification (ex: /api/register, /api/login)
app.use('/api', authRoutes);

// Routes utilisateur (ex: /api/user, /api/user/:id)
// Placé avant movieRoutes car /api/user est plus spécifique que /api/movies
app.use('/api/user', userRoutes);

// Routes des films (ex: /api/movies, /api/movies/:id)
app.use('/api/movies', movieRoutes);
// Route racine simple pour vérifier que l'API est en ligne
app.get('/', (req, res) => {
  res.send('API Netflix est en ligne');
});



// --- Routes de gestion des films spécifiques (si elles ne sont pas dans movieRoutes) ---
// Si ces routes étaient déjà définies dans votre fichier './routes/movies.js' et exportées via movieRoutes,
// alors vous pouvez supprimer ces blocs redondants ici. Je les laisse au cas où elles ne le seraient pas.

// Route GET /api/movies (récupérer tous les films)
// Si déjà dans movieRoutes, supprimez ce bloc
app.get('/api/movies', async (req, res) => {
  try {
    // Assurez-vous que dbConfig est défini ou que pool est correctement initialisé ailleurs
    // Si pool.query est une fonction, pas besoin de connection.execute ni connection.end()
    const [rows] = await pool.query('SELECT * FROM movies ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des films:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Nouvelle route pour récupérer un film spécifique
// Si déjà dans movieRoutes, supprimez ce bloc
app.get('/api/movies/:id', async (req, res) => {
  try {
    const movieId = req.params.id;
    const [rows] = await pool.query('SELECT * FROM movies WHERE id = ?', [movieId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Film non trouvé' });
    }

    const movie = rows[0];

    // Si le genre est stocké comme string JSON, le parser
    if (typeof movie.genre === 'string') {
      try {
        movie.genre = JSON.parse(movie.genre);
      } catch (e) {
        console.warn('Erreur lors du parsing du genre:', e);
        movie.genre = [];
      }
    }

    res.json(movie);
  } catch (error) {
    console.error('Erreur lors de la récupération du film:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route POST /api/movies (ajouter un film)
// Si déjà dans movieRoutes, supprimez ce bloc
app.post('/api/movies', upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'video', maxCount: 1 },
]), async (req, res) => {
  try {
    const {
      title, description, category, year, rating, duration, genre, featured
    } = req.body;

    const thumbnailPath = req.files['thumbnail']?.[0].filename;
    const videoPath = req.files['video']?.[0].filename;

    // Assurez-vous que dbConfig est défini ou que pool est correctement initialisé
    // Si pool.query est une fonction, pas besoin de connection.execute
    const [result] = await pool.query(
      `INSERT INTO movies (title, description, thumbnail_url, video_url, category, year, rating, duration, genre, featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description,
        `/uploads/${thumbnailPath}`,
        `/uploads/${videoPath}`,
        category,
        year,
        rating,
        duration,
        JSON.stringify(JSON.parse(genre)),
        featured === 'true'
      ]
    );

    res.status(201).json({ id: result.insertId });
  } catch (error) {
    console.error('Erreur ajout:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route PUT /api/movies/:id (modifier un film)
// Si déjà dans movieRoutes, supprimez ce bloc
app.put('/api/movies/:id', async (req, res) => {
  try {
    const movieId = req.params.id;
    const {
      title,
      description,
      thumbnail_url,
      video_url,
      category,
      year,
      rating,
      duration,
      genre,
      featured
    } = req.body;

    // Assurez-vous que mysql et dbConfig sont correctement définis
    // Si vous utilisez 'pool', remplacez par pool.query
    const [result] = await pool.query( // Supposons que vous utilisez 'pool' pour toutes les requêtes SQL
      `UPDATE movies SET title=?, description=?, thumbnail_url=?, video_url=?, category=?, year=?, rating=?, duration=?, genre=?, featured=? WHERE id=?`,
      [title, description, thumbnail_url, video_url, category, year, rating, duration, JSON.stringify(genre), featured, movieId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Film non trouvé pour la mise à jour' });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la modification du film:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route DELETE /api/movies/:id (supprimer un film)
// Si déjà dans movieRoutes, supprimez ce bloc
app.delete('/api/movies/:id', async (req, res) => {
  try {
    const movieId = req.params.id;
    // Assurez-vous que mysql et dbConfig sont correctement définis
    // Si vous utilisez 'pool', remplacez par pool.query
    const [result] = await pool.query('DELETE FROM movies WHERE id = ?', [movieId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Film non trouvé pour la suppression' });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression du film:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});



app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  let conn;
  try {
    conn = await pool.getConnection();

    const [users] = await conn.query('SELECT id FROM users WHERE email = ?', [email]);

    if (users.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    }

    const userId = users[0].id;

    // Générer un token JWT valable 15 minutes
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '15m' }); // ✅

    const resetLink = `http://localhost:5173/reset-password/${token}`; // Ce lien est correct

    await transporter.sendMail({
      from: process.env.RESET_EMAIL_FROM,
      to: email,
      subject: 'Réinitialisation de votre mot de passe',
      html: `
        <h3>Réinitialisation de mot de passe</h3>
        <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
        <p><a href="${resetLink}">Cliquez ici pour réinitialiser</a> (lien valable 15 minutes)</p>
      `,
    });

    res.status(200).json({ message: 'Email de réinitialisation envoyé.' });
  } catch (error) {
    console.error('Erreur forgot-password :', error);
    res.status(500).json({ error: 'Erreur serveur.' });
  } finally {
    if (conn) conn.release();
  }
});


app.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body; // On récupère "password"

  if (!password) {
    return res.status(400).json({ error: 'Le mot de passe est requis.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const hashedPassword = await bcrypt.hash(password, 10);

    const conn = await pool.getConnection();
    await conn.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);
    conn.release();

    res.status(200).json({ message: 'Mot de passe mis à jour avec succès.' });
  } catch (error) {
    console.error('Erreur reset-password (POST) :', error);
    res.status(400).json({ error: 'Lien invalide ou expiré.' });
  }
});


const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.post('/create-checkout-session', async (req, res) => {
  const { price, email } = req.body; // ✅ Ajout de "email"

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email, // ✅ Utilisation directe

      line_items: [
        {
          price_data: {
            currency: 'xaf', // FCFA
            product_data: {
              name: 'Abonnement Standard',
            },
            unit_amount: 2000,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:5173/success',
      cancel_url: 'http://localhost:5173/subscription',
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erreur création session' });
  }
});


app.get('/api/verify-token', authMiddleware, (req, res) => {
  res.json({ valid: true, user: req.user });
});


// --- Démarrage du Serveur ---
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur le port ${PORT}`);
});