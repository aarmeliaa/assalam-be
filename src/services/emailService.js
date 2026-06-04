const { config } = require('../config/env');
const RESEND_API_URL = 'https://api.resend.com/emails';

const sendEmail = async ({ to, subject, html, text }) => {
  const apiKey = config.resend.apiKey;
  const fromEmail = config.resend.fromEmail;

  if (!apiKey || !fromEmail) {
    if (config.isDevelopment) {
      console.log('[EMAIL DEV MODE] Skipping email send. Missing Resend credentials.');
      console.log(`  To: ${to}`);
      console.log(`  Subject: ${subject}`);
      console.log(`  Body: ${text || html}`);
      return { success: true, simulated: true };
    }
    throw new Error('Resend API key and from email are required to send emails');
  }

  const payload = {
    from: fromEmail,
    to,
    subject,
    html,
    text
  };

  const response = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend API error (${response.status}): ${body}`);
  }

  return response.json();
};

module.exports = {
  sendEmail
};
