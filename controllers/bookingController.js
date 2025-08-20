// controllers/bookingController.js
exports.createBooking = async (req, res) => {
  try {
    const {
      doctorId,
      doctorName,
      userId,
      username,
      patientName,
      patientAge,
      contactNumber,
      description,
      date,
      time,
      status,
      remarks,
      paymentImageUrl
    } = req.body;

    if (!doctorId || !userId || !patientName || !date || !time) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const [result] = await global.db.query(
      `INSERT INTO bookings 
        (doctorId, doctorName, userId, username, patientName, patientAge, contactNumber, description, date, time, status, remarks, paymentImageUrl) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        doctorId,
        doctorName || null,
        userId,
        username || null,
        patientName,
        patientAge || null,
        contactNumber || null,
        description || null,
        date,
        time,
        status || "Pending",
        remarks || null,
        paymentImageUrl || null
      ]
    );

    res.status(201).json({
      message: "Booking created successfully",
      bookingId: result.insertId
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get bookings by userId
exports.getBookingsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const [rows] = await global.db.query(
      "SELECT * FROM bookings WHERE userId = ? ORDER BY createdAt DESC",
      [userId]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching bookings by userId:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get bookings by doctorId
exports.getBookingsByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const [rows] = await global.db.query(
      "SELECT * FROM bookings WHERE doctorId = ? ORDER BY createdAt DESC",
      [doctorId]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching bookings by doctorId:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
