const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const FROM_EMAIL = process.env.SMTP_FROM || process.env.SMTP_USER;
const TO_EMAIL = process.env.BEWERBUNG_TO || 'christof.drost@landau.de';
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';

app.use(cors({ origin: ALLOWED_ORIGIN }));
app.use(express.json());

function required(value) {
  return typeof value === 'string' ? value.trim() : '';
}

app.post('/api/bewerbung', async (req, res) => {
  const vorname = required(req.body.vorname);
  const nachname = required(req.body.nachname);
  const email = required(req.body.email);
  const telefon = required(req.body.telefon);
  const alter = required(String(req.body.alter || ''));
  const artLabel = required(req.body.artLabel);
  const motivation = required(req.body.motivation);
  const skills = Array.isArray(req.body.skills) ? req.body.skills : [];

  if (!vorname || !email || !artLabel) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: String(process.env.SMTP_SECURE || 'false') === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const subject = `Neue Bewerbung LA OLA - ${vorname}${nachname ? ` ${nachname}` : ''}`;
    const text = [
      'Neue Bewerbung über das LA OLA Karriere-Formular',
      '',
      `Vorname: ${vorname}`,
      `Nachname: ${nachname || '-'}`,
      `E-Mail: ${email}`,
      `Telefon: ${telefon || '-'}`,
      `Alter: ${alter || '-'}`,
      `Interesse: ${artLabel}`,
      `Motivation: ${motivation || '-'}`,
      `Ich kann bereits: ${skills.length ? skills.join(', ') : '-'}`,
      '',
      `Gesendet am: ${new Date().toLocaleString('de-DE')}`
    ].join('\n');

    await transporter.sendMail({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: email,
      subject,
      text
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Mail send failed:', error);
    return res.status(500).json({ error: 'Mail send failed' });
  }
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
