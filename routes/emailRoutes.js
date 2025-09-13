// routes/emailRoutes.js
const express = require("express");
const nodemailer = require("nodemailer");
const multer = require("multer");

const router = express.Router();
const upload = multer(); // for handling PDF uploads

// ✅ Setup Zoho transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,     // smtp.zoho.in
  port: process.env.EMAIL_PORT,     // 465
  secure: process.env.EMAIL_SECURE === "true", // true for 465
  auth: {
    user: process.env.EMAIL_USER,   // medbookapp@zohomail.in
    pass: process.env.EMAIL_PASS,   // your Zoho app password
  },
});

// ✅ API to send Welcome Email with Invoice (no dashboard link)
router.post("/send-email", upload.single("pdf"), async (req, res) => {
  try {
    const { email, name, packageName } = req.body; 
    const pdfBuffer = req.file?.buffer;

    // ✅ Email Template (HTML without link)
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #2c3e50;">You're In! 🎉 A huge welcome to MedBook 🩺</h2>
        <p>Hi <strong>${name}</strong>,</p>

        <p>A huge welcome to <b>MedBook</b>! We're so excited to have you on board and can't wait to help you grow your practice and manage your appointments with ease.</p>

        <p>Your subscription to the <b>${packageName}</b> plan is all set up. Your invoice is attached—please let us know if you need any help understanding it.</p>

        <p>The next step is the fun part! Complete your profile on the MedBook app to show patients why you're an amazing doctor. The more complete your profile, the more bookings you'll get!</p>

        <p>We're here for you every step of the way.</p>

        <p>Welcome to the future of healthcare management!</p>

        <p>Cheers,<br/>The Team at MedBook</p>
        <hr/>
        <small>Need help? Just reply to this email!</small>
      </div>
    `;

    // ✅ Send Email
    await transporter.sendMail({
      from: `"MedBook" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "You're In! A huge welcome to MedBook 🩺",
      html: htmlContent,
      attachments: pdfBuffer
        ? [{ filename: "invoice.pdf", content: pdfBuffer }]
        : [],
    });

    res.json({ success: true, message: "✅ Welcome email sent successfully" });
  } catch (err) {
    console.error("❌ Email sending error:", err);
    res.status(500).json({ success: false, error: "Failed to send email" });
  }
});

module.exports = router;
