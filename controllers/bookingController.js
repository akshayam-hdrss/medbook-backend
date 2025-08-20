// controllers/bookingController.js
const { getIO } = require('../middleware/socket');

exports.createBooking = async (req, res) => {
  try {
    const {
      doctorId, userId, patientName, patientAge,
      contactNumber, description, date, time
    } = req.body;

    // Insert booking
    const [result] = await global.db.query(
      `INSERT INTO bookings
       (doctorId, userId, patientName, patientAge, contactNumber, description, date, time)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [doctorId, userId, patientName, patientAge, contactNumber, description, date, time]
    );

    const bookingId = result.insertId;

    // Notify doctor
    const title = 'New Booking';
    const message = `New booking from user ${userId} on ${date} at ${time}.`;
    await global.db.query(
      `INSERT INTO notifications (userId, bookingId, title, message)
       VALUES (?, ?, ?, ?)`,
      [doctorId, bookingId, title, message]
    );

    // Push via socket
    try { getIO().to(String(doctorId)).emit('notification', { bookingId, title, message }); } catch {}

    res.json({ success: true, bookingId });
  } catch (err) {
    console.error('createBooking error:', err);
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

exports.updateStatusByDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks, date, time } = req.body;

    // Update booking
    await global.db.query(
      `UPDATE bookings SET status=?, remarks=?, date=COALESCE(?, date), time=COALESCE(?, time) WHERE id=?`,
      [status, remarks || null, date || null, time || null, id]
    );

    // Find booking
    const [rows] = await global.db.query(
      `SELECT userId, doctorId, date, time FROM bookings WHERE id=?`,
      [id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Booking not found' });

    const { userId, doctorId, date: d, time: t } = rows[0];

    // Build message
    let title = 'Booking Update';
    let message = '';
    if (status === 'Confirmed') message = `Your booking has been confirmed for ${d} ${t}.`;
    else if (status === 'Rescheduled') message = `Your booking was rescheduled to ${d} ${t}.`;
    else if (status === 'Cancelled') message = `Your booking was cancelled by the doctor.`;
    else message = `Status changed to ${status}.`;

    // Notify user
    await global.db.query(
      `INSERT INTO notifications (userId, bookingId, title, message)
       VALUES (?, ?, ?, ?)`,
      [userId, id, title, message]
    );

    try { getIO().to(String(userId)).emit('notification', { bookingId: Number(id), title, message }); } catch {}

    res.json({ success: true });
  } catch (err) {
    console.error('updateStatusByDoctor error:', err);
    res.status(500).json({ error: 'Failed to update status' });
  }
};

exports.userAcceptReschedule = async (req, res) => {
  try {
    const { id } = req.params;

    // Confirm booking
    await global.db.query(
      `UPDATE bookings SET status='Confirmed' WHERE id=?`,
      [id]
    );

    // Find booking
    const [rows] = await global.db.query(
      `SELECT userId, doctorId, date, time FROM bookings WHERE id=?`,
      [id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Booking not found' });

    const { doctorId, date, time } = rows[0];

    // Notify doctor
    const title = 'Reschedule Accepted';
    const message = `User accepted the rescheduled time ${date} ${time}.`;
    await global.db.query(
      `INSERT INTO notifications (userId, bookingId, title, message)
       VALUES (?, ?, ?, ?)`,
      [doctorId, id, title, message]
    );

    try { getIO().to(String(doctorId)).emit('notification', { bookingId: Number(id), title, message }); } catch {}

    res.json({ success: true });
  } catch (err) {
    console.error('userAcceptReschedule error:', err);
    res.status(500).json({ error: 'Failed to accept reschedule' });
  }
};

exports.userCancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    await global.db.query(
      `UPDATE bookings SET status='Cancelled' WHERE id=?`,
      [id]
    );

    const [rows] = await global.db.query(
      `SELECT userId, doctorId FROM bookings WHERE id=?`,
      [id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Booking not found' });

    const { doctorId } = rows[0];

    const title = 'Booking Cancelled';
    const message = 'User cancelled the booking.';
    await global.db.query(
      `INSERT INTO notifications (userId, bookingId, title, message)
       VALUES (?, ?, ?, ?)`,
      [doctorId, id, title, message]
    );

    try { getIO().to(String(doctorId)).emit('notification', { bookingId: Number(id), title, message }); } catch {}

    res.json({ success: true });
  } catch (err) {
    console.error('userCancelBooking error:', err);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
};

exports.getBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await global.db.query(
      `SELECT * FROM bookings WHERE id=?`,
      [id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
};

exports.listBookings = async (req, res) => {
  try {
    const { userId, role } = req.query; // role = 'doctor' | 'user'
    let sql = '';
    if (role === 'doctor') {
      sql = `SELECT * FROM bookings WHERE doctorId=? ORDER BY createdAt DESC`;
    } else {
      sql = `SELECT * FROM bookings WHERE userId=? ORDER BY createdAt DESC`;
    }
    const [rows] = await global.db.query(sql, [userId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to list bookings' });
  }
};
