const client = require('../middleware/twilioClient');

const sendWhatsappMessage = async (req, res) => {
  const { to, message } = req.body;

  if (!to || !message) {
    return res.status(400).json({ error: 'Missing phone number or message' });
  }

  try {
    const response = await client.messages.create({
      from: 'whatsapp:+14155238886', // Twilio sandbox number
      to: `whatsapp:${to}`,
      body: message
    });

    res.status(200).json({ success: true, sid: response.sid });
  } catch (error) {
    console.error('Twilio Error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { sendWhatsappMessage };
