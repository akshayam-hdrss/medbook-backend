const db = global.db;
const nodemailer = require('nodemailer');
require('dotenv').config();

// Helper to convert "05:30 pm" to "17:30:00"
function convertTo24HourFormat(timeStr) {
  const [time, modifier] = timeStr.toLowerCase().split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  if (modifier === 'pm' && hours !== 12) {
    hours += 12;
  }
  if (modifier === 'am' && hours === 12) {
    hours = 0;
  }

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:00`;
}

exports.createSchedule = async (req, res) => {
  const { userId, date, time, description, doctorId, doctorName, username, status, contactNo, age } = req.body;

  try {
    const convertedTime = convertTo24HourFormat(time); // Convert to 24-hour format for DB

    const [result] = await db.query(
      `INSERT INTO schedule (userId, date, time, description, doctorId, doctorName, username, status, contactNo, age)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, date, convertedTime, description, doctorId, doctorName, username, status, contactNo, age]
    );

    // Setup email
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST, // smtp.zoho.in
      port: parseInt(process.env.EMAIL_PORT), // 465
      secure: process.env.EMAIL_SECURE === 'true', // true
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Scheduler" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: 'New Schedule Created',
      text: `
New schedule created:

User: ${username} (ID: ${userId})
Age: ${age}
Doctor: ${doctorName} (ID: ${doctorId})
Date: ${date}
Time: ${time}
Contact No: ${contactNo}
Description: ${description}
Status: ${status}
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'Schedule created and email sent to admin' });
  } catch (error) {
    console.error('Schedule creation error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getAllSchedules = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM schedule');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch schedules' });
  }
};

exports.getSchedulesByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT doctorId, doctorName, date, time, description, status FROM schedule WHERE userId = ?`,
      [userId]
    );
    res.status(200).json({ result: "Success", resultData: rows });
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch schedules for user' });
  }
};
