import express from 'express';
import Stripe from 'stripe';
import { pool } from '../db.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


// ✅ Créer la session de paiement
router.post('/create-checkout-session', async (req, res) => {
  const { email } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'xof',
          product_data: {
            name: 'Abonnement Standard',
          },
          unit_amount: 2000,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/success?email=${email}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      customer_email: email,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: 'Stripe checkout failed' });
  }
});

// ✅ Webhook Stripe pour mettre à jour la BDD après le paiement
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = 'ta_clef_webhook'; // récupérée dans Stripe > Webhook

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error(`⚠️ Webhook error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Paiement réussi
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const email = session.customer_email;

    // 🟢 Update l’utilisateur dans la BDD
    await pool.query('UPDATE users SET is_admin = 1 WHERE email = ?', [email]);
  }

  res.status(200).send('Received');
});


export default router;
