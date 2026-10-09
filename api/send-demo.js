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

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, DEMO_TO } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    console.error('Missing SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS env vars');
    return res.status(500).json({ error: 'Email is not configured yet — email hello@vanoora.com directly.' });
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
      to: DEMO_TO || SMTP_USER,
      replyTo: email,
      subject: `Demo request from ${email}`,
      text: `From: ${email}\n\n${description}`
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('send-demo failed:', err);
    return res.status(502).json({ error: 'Could not send right now — email hello@vanoora.com directly.' });
  }
};
