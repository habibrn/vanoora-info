const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, description } = req.body || {};

  if (typeof email !== 'string' || typeof description !== 'string' ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !description.trim()) {
    return res.status(400).json({ error: 'A valid email and description are required.' });
  }

  const SMTP_HOST = (process.env.SMTP_HOST || '').trim();
  const SMTP_PORT = (process.env.SMTP_PORT || '').trim();
  const SMTP_USER = (process.env.SMTP_USER || '').trim();
  const SMTP_PASS = (process.env.SMTP_PASS || '').trim();
  const toAddr = (process.env.DEMO_TO || SMTP_USER || '').trim();

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !toAddr) {
    console.error('Missing SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS/DEMO_TO env vars');
    return res.status(500).json({ error: 'Email is not configured yet — email hello@vanoora.com directly.' });
  }
  if (process.env.DEBUG_DEMO) {
    console.log('resolved to:', JSON.stringify(toAddr), 'from:', JSON.stringify(SMTP_USER));
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  });

  try {
    await transporter.sendMail({
      from: `"Vanoora website" <${SMTP_USER}>`,
      to: toAddr,
      replyTo: email,
      subject: `Demo request from ${email}`,
      text: `From: ${email}\n\n${description}`
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('send-demo failed:', err);
    const detail = process.env.DEBUG_DEMO ? ` (${err.code || err.name}: ${err.message})` : '';
    return res.status(502).json({ error: 'Could not send right now — email hello@vanoora.com directly.' + detail });
  }
};
