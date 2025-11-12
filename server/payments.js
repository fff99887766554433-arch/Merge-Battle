// server/payments.js
const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const axios = require('axios');
const stripe = process.env.STRIPE_SECRET_KEY ? Stripe(process.env.STRIPE_SECRET_KEY) : null;

/**
 * Placeholder: atomically credit user coins.
 * Replace with your DB logic (Postgres / MySQL / Firestore).
 * Must ensure idempotency by provider_tx_id.
 */
async function creditUserAtomic(userId, coins, meta) {
  console.log('creditUserAtomic', { userId, coins, meta });
  // TODO: implement DB update here.
  return true;
}

function convertCentsToCoins(cents) {
  return Math.round(cents / 100 * 100);
}

router.post('/stripe/create-payment-intent', async (req, res) => {
  if (!stripe) return res.status(400).json({ error: 'Stripe not configured' });
  const { amountCents, currency = 'usd', userId } = req.body;
  if (!amountCents || !userId) return res.status(400).json({ error: 'amountCents and userId required' });
  try {
    const pi = await stripe.paymentIntents.create({
      amount: amountCents,
      currency,
      metadata: { userId }
    });
    res.json({ clientSecret: pi.client_secret });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  if (!stripe) return res.status(400).send('Stripe not configured');
  const sig = req.headers['stripe-signature'];
  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    if (event.type === 'payment_intent.succeeded') {
      const pi = event.data.object;
      const userId = pi.metadata && pi.metadata.userId;
      const coins = convertCentsToCoins(pi.amount);
      await creditUserAtomic(userId, coins, { provider: 'stripe', provider_tx: pi.id });
    }
    res.json({ received: true });
  } catch (err) {
    console.error('stripe webhook error', err?.message || err);
    res.status(400).send(`Webhook error: ${err?.message || err}`);
  }
});

// validate receipt for RN (Apple/Google)
router.post('/validate-receipt', async (req, res) => {
  const { platform, userId, receiptData } = req.body;
  if (!platform || !userId || !receiptData) return res.status(400).json({ error: 'platform, userId, receiptData required' });
  try {
    if (platform === 'ios') {
      // Validate with Apple verifyReceipt endpoint
      const endpoint = process.env.APPLE_VERIFY_URL || 'https://buy.itunes.apple.com/verifyReceipt';
      const resp = await axios.post(endpoint, {
        'receipt-data': receiptData,
        'password': process.env.APPLE_SHARED_SECRET
      }, { timeout: 15000 });
      const status = resp.data.status;
      if (status === 0) {
        // TODO: parse resp.data to map product_id -> coins
        const coins = 100;
        await creditUserAtomic(userId, coins, { provider: 'apple', raw: resp.data });
        return res.json({ ok: true, awarded: coins });
      } else {
        return res.status(400).json({ error: 'Invalid Apple receipt', status: resp.data.status });
      }
    } else if (platform === 'android') {
      // TODO: implement Google Play Developer API validation with service account
      const coins = 100;
      await creditUserAtomic(userId, coins, { provider: 'google', raw: receiptData });
      return res.json({ ok: true, awarded: coins });
    } else {
      return res.status(400).json({ error: 'Unknown platform' });
    }
  } catch (err) {
    console.error('validate-receipt error', err);
    res.status(500).json({ error: 'validation_failed', details: err?.message || String(err) });
  }
});

module.exports = router;
