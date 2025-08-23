const { getIO } = require("../middleware/socket");

// ✅ Create booking (notify Doctor)
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
      paymentImageUrl,
      isOnline
    } = req.body;

    if (!doctorId || !userId || !patientName || !date || !time) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const [result] = await global.db.query(
      `INSERT INTO bookings 
        (doctorId, doctorName, userId, username, patientName, patientAge, contactNumber, description, date, time, status, remarks, paymentImageUrl, isOnline) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        paymentImageUrl || null,
        isOnline || 0
      ]
    );

    const newBookingId = result.insertId;

    // ✅ Send notification to Doctor only
    const io = getIO();
    io.to(`doctor_${doctorId}`).emit("bookingNotification", {
      type: "BookingCreated",
      bookingId: newBookingId,
      patientName,
      date,
      time,
      message: `New booking from ${patientName}`
    });

    res.status(201).json({
      message: "Booking created successfully",
      bookingId: newBookingId
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Update booking (notify based on who edited)
exports.updateBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const {
      status,
      remarks,
      date,
      time,
      userId,
      doctorId,
      editedBy
    } = req.body;

    if (!status && !remarks && !date && !time) {
      return res.status(400).json({ message: "At least one field required" });
    }

    const [result] = await global.db.query(
      `UPDATE bookings 
       SET 
         status = COALESCE(?, status), 
         remarks = COALESCE(?, remarks),
         date = COALESCE(?, date),
         time = COALESCE(?, time)
       WHERE id = ?`,
      [status, remarks, date, time, bookingId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // ✅ Notifications based on who edited
    const io = getIO();
    if (editedBy === "user" && doctorId) {
      io.to(`doctor_${doctorId}`).emit("bookingNotification", {
        type: "BookingUpdated",
        bookingId,
        status,
        remarks,
        date,
        time,
        message: "A booking was updated by the user"
      });
    } else if (editedBy === "doctor" && userId) {
      io.to(`user_${userId}`).emit("bookingNotification", {
        type: "BookingUpdated",
        bookingId,
        status,
        remarks,
        date,
        time,
        message: "Your booking was updated by the doctor"
      });
    }

    res.status(200).json({ message: "Booking updated successfully" });
  } catch (error) {
    console.error("Error updating booking:", error);
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




exports.getDoctorByPhone = async (req, res) => {
  try {
    const { phone } = req.params;

    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    const [rows] = await global.db.query(
      "SELECT id AS userId, name, phone, isDoctor FROM users WHERE phone = ? AND isDoctor = TRUE",
      [phone]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Doctor not found for this phone number" });
    }

    res.status(200).json(rows[0]); // { userId, name, phone, isDoctor }
  } catch (error) {
    console.error("Error fetching doctor by phone:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
