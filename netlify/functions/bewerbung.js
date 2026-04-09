const nodemailer = require('nodemailer');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body || '{}');

    const vorname = String(data.vorname || '').trim();
    const nachname = String(data.nachname || '').trim();
    const email = String(data.email || '').trim();
    const telefon = String(data.telefon || '').trim();
    const alter = String(data.alter || '').trim();
    const artLabel = String(data.artLabel || '').trim();
    const motivation = String(data.motivation || '').trim();
    const skills = Array.isArray(data.skills) ? data.skills : [];

    if (!vorname || !email || !artLabel) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

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
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.BEWERBUNG_TO || 'christof.drost@landau.de',
      replyTo: email,
      subject,
      text
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true })
    };
  } catch (err) {
    console.error('Netlify mail send failed:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Mail send failed' })
    };
  }
};
