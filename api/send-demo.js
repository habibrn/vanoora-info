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

  const RESEND_API_KEY = (process.env.RESEND_API_KEY || '').trim();
  const FROM_ADDR = (process.env.DEMO_FROM || 'Vanoora website <hello@vanoora.com>').trim();
  const toAddr = (process.env.DEMO_TO || 'hello@vanoora.com').trim();

  if (!RESEND_API_KEY) {
    console.error('Missing RESEND_API_KEY env var');
    return res.status(500).json({ error: 'Email is not configured yet — email hello@vanoora.com directly.' });
  }

  try {
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: FROM_ADDR,
        to: toAddr,
        reply_to: email,
        subject: `Demo request from ${email}`,
        text: `From: ${email}\n\n${description}`
      })
    });

    if (!resp.ok) {
      const body = await resp.text();
      console.error('send-demo failed:', resp.status, body);
      const detail = process.env.DEBUG_DEMO ? ` (${resp.status}: ${body})` : '';
      return res.status(502).json({ error: 'Could not send right now — email hello@vanoora.com directly.' + detail });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('send-demo failed:', err);
    const detail = process.env.DEBUG_DEMO ? ` (${err.code || err.name}: ${err.message})` : '';
    return res.status(502).json({ error: 'Could not send right now — email hello@vanoora.com directly.' + detail });
  }
};
