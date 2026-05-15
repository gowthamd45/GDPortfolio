const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

async function submitContact(req, res) {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: 'Name, email, subject, and message are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email address.' });
  }

  try {
    const entry = await Contact.create({
      name:       name.trim(),
      email:      email.trim().toLowerCase(),
      phone:      phone ? phone.trim() : null,
      subject:    subject.trim(),
      message:    message.trim(),
      ip_address: req.ip || null
    });

    if (process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SMTP_PASS !== 'your_app_password_here') {
      await sendEmailNotification({ name, email, phone, subject, message }).catch(() => {});
    }

    res.status(201).json({
      success: true,
      message: "Message received! I'll get back to you within 24 hours.",
      id: entry._id
    });
  } catch (err) {
    console.error('Contact save error:', err);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
}

async function getMessages(_req, res) {
  const rows = await Contact.find().sort({ created_at: -1 }).lean();
  res.json({ success: true, count: rows.length, data: rows });
}

async function sendEmailNotification({ name, email, phone, subject, message }) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });

  await transporter.sendMail({
    from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
    to:   process.env.NOTIFY_EMAIL,
    subject: `Portfolio: ${subject}`,
    html: `
      <h2>New Portfolio Inquiry</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <hr/>
      <p>${message.replace(/\n/g, '<br/>')}</p>
    `
  });
}

module.exports = { submitContact, getMessages };
