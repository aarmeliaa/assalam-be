const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL;
const RESEND_API_URL = 'https://api.resend.com/emails';

if (!RESEND_API_KEY) {
  throw new Error('Missing required environment variable RESEND_API_KEY');
}

if (!RESEND_FROM_EMAIL) {
  throw new Error('Missing required environment variable RESEND_FROM_EMAIL');
}

const sendEmail = async ({ to, subject, html, text }) => {
  const payload = {
    from: RESEND_FROM_EMAIL,
    to,
    subject,
    html,
    text
  };

  const response = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${RESEND_API_KEY}`
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
