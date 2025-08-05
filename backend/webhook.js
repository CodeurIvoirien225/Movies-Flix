// webhook.js
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const bodyParser = require('body-parser');
const pool = require('./db'); // Connexion MySQL

router.post('/', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  console.log("🔔 Webhook reçu !"); // Log de test
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    console.log(`✅ Webhook Stripe reçu avec type : ${event.type}`);
  } catch (err) {
    console.error('❌ Erreur de signature Stripe :', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const email = session.customer_details?.email || session.customer_email;

      if (!email) {
        console.warn('⚠️ Aucun email fourni dans la session');
        return res.status(400).send('Email manquant');
      }

      console.log(`📩 Email reçu depuis Stripe : ${email}`);

      const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

      if (rows.length > 0) {
        await pool.query('UPDATE users SET is_subscribed = 1 WHERE email = ?', [email]);
        console.log(`✅ Statut mis à jour pour ${email}`);
      } else {
        console.warn(`⚠️ Aucun utilisateur trouvé avec l'email ${email}`);
      }
    }

    res.status(200).send('✅ Webhook reçu');
  } catch (error) {
    console.error('❌ Erreur générale dans le webhook :', error.message);
    res.status(500).send('Erreur webhook');
  }
});


module.exports = router;
