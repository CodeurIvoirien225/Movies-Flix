const express = require('express');
const router = express.Router();
const pool = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 📁 Dossier pour stocker les fichiers
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// 📷 Configuration Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// ✅ GET all movies
router.get('/', async (req, res) => {
  try {
    let query = 'SELECT * FROM movies';
    const params = [];
    
    if (req.query.category) {
      query += ' WHERE category = ?';
      params.push(req.query.category);
    }
    
    if (req.query.search) {
      const searchCondition = ' WHERE title LIKE ? OR description LIKE ?';
      query += req.query.category ? ' AND' : searchCondition;
      params.push(`%${req.query.search}%`, `%${req.query.search}%`);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});



// ✅ POST: Ajouter un film avec fichiers
router.post('/', upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), async (req, res) => {
  try {
    const {
      title, description, category, year,
      rating, duration, genre, featured
    } = req.body;

    const thumbnail = req.files['thumbnail']?.[0]?.filename;
    const video = req.files['video']?.[0]?.filename;

    const [result] = await pool.query(`
      INSERT INTO movies 
      (title, description, thumbnail_url, video_url, category, year, rating, duration, genre, featured) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description,
        `/uploads/${thumbnail}`,
        `/uploads/${video}`,
        category,
        parseInt(year),
        rating,
        duration,
        JSON.stringify(Array.isArray(genre) ? genre : genre.split(',')),
        featured === 'true' || featured === true
      ]
    );

    const [movie] = await pool.query('SELECT * FROM movies WHERE id = ?', [result.insertId]);
    res.status(201).json(movie[0]);

  } catch (err) {
    console.error('❌ POST /api/movies error:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


router.put('/:id', upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), async (req, res) => {
  try {
    const id = req.params.id;
    const {
      title, description, category, year, rating,
      duration, genre, featured
    } = req.body;

    const thumbnail = req.files?.['thumbnail']?.[0];
    const video = req.files?.['video']?.[0];
    

    // Récupère les anciens chemins
    const [oldMovieRows] = await pool.query(
      'SELECT thumbnail_url, video_url FROM movies WHERE id = ?', 
      [id]
    );
    
    if (oldMovieRows.length === 0) {
      return res.status(404).json({ message: 'Film non trouvé' });
    }

    const oldMovie = oldMovieRows[0];
    
    // Validation des URLs
    if (!oldMovie.thumbnail_url && !thumbnail) {
      return res.status(400).json({ message: 'La miniature est obligatoire' });
    }
    if (!oldMovie.video_url && !video) {
      return res.status(400).json({ message: 'La vidéo est obligatoire' });
    }

    const thumbnail_url = thumbnail ? `/uploads/${thumbnail.filename}` : oldMovie.thumbnail_url;
    const video_url = video ? `/uploads/${video.filename}` : oldMovie.video_url;

    // Conversion du genre si nécessaire
    let parsedGenre = genre;
    try {
      parsedGenre = genre ? JSON.stringify(JSON.parse(genre)) : null;
    } catch (e) {
      parsedGenre = null;
    }

    await pool.query(
      `UPDATE movies
       SET title=?, description=?, thumbnail_url=?, video_url=?, category=?, year=?, rating=?, duration=?, genre=?, featured=?
       WHERE id=?`,
      [
        title,
        description,
        thumbnail_url,
        video_url,
        category,
        year ? parseInt(year) : null,
        rating,
        duration,
        parsedGenre,
        featured === 'true',
        id
      ]
    );

    const [updated] = await pool.query('SELECT * FROM movies WHERE id = ?', [id]);
    res.json(updated[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      message: 'Erreur lors de la mise à jour',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});


// DELETE /api/movies/:id - supprime un film
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await pool.query('DELETE FROM movies WHERE id = ?', [id]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
