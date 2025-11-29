const { getIO } = require("../middleware/socket");

// ===============================================
// 🔍 Get Service Provider by Phone
// ===============================================
exports.getServiceByPhone = async (req, res) => {
  try {
    const { phone } = req.params;

    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    const [rows] = await global.db.query(
      "SELECT id AS userId, name, phone, isService FROM users WHERE phone = ? AND isService = TRUE",
      [phone]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Service provider not found for this phone number" });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error fetching service by phone:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ===============================================
// 🟢 Create Service Booking (with gender)
// ===============================================
exports.createServiceBooking = async (req, res) => {
  try {
    const {
      serviceId,
      serviceName,
      userId,
      username,
      customerName,
      customerAge,
      customerGender,  // ✓ NEW FIELD
      contactNumber,
      description,
      date,
      time,
      status,
      remarks,
      paymentImageUrl,
      isOnline,
    } = req.body;

    if (!serviceId || !userId || !customerName || !date || !time) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const [result] = await global.db.query(
      `INSERT INTO service_bookings 
        (serviceId, serviceName, userId, username, customerName, customerAge, customerGender,
         contactNumber, description, date, time, status, remarks, paymentImageUrl, isOnline) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        serviceId,
        serviceName || null,
        userId,
        username || null,
        customerName,
        customerAge || null,
        customerGender || null,   // ✓ INSERTED
        contactNumber || null,
        description || null,
        date,
        time,
        status || "Pending",
        remarks || null,
        paymentImageUrl || null,
        isOnline || 0,
      ]
    );

    const newBookingId = result.insertId;

    // 🔔 Notify service provider
    const io = getIO();
    io.to(`service_${serviceId}`).emit("serviceBookingNotification", {
      type: "ServiceBookingCreated",
      bookingId: newBookingId,
      customerName,
      customerGender,  // ✓ Include gender in notification
      date,
      time,
      message: `New service booking from ${customerName}`,
    });

    res.status(201).json({
      message: "Service booking created successfully",
      bookingId: newBookingId,
    });
  } catch (error) {
    console.error("Error creating service booking:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ===============================================
// ✏ Update Service Booking
// ===============================================
exports.updateServiceBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status, remarks, date, time, userId, serviceId, editedBy } =
      req.body;

    if (!status && !remarks && !date && !time) {
      return res.status(400).json({ message: "At least one field required" });
    }

    const [result] = await global.db.query(
      `UPDATE service_bookings 
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

    const io = getIO();

    if (editedBy === "user" && serviceId) {
      io.to(`service_${serviceId}`).emit("serviceBookingNotification", {
        type: "ServiceBookingUpdated",
        bookingId,
        status,
        remarks,
        date,
        time,
        message: "A service booking was updated by the user",
      });
    } else if (editedBy === "service" && userId) {
      io.to(`user_${userId}`).emit("serviceBookingNotification", {
        type: "ServiceBookingUpdated",
        bookingId,
        status,
        remarks,
        date,
        time,
        message: "Your service booking was updated",
      });
    }

    res.status(200).json({ message: "Service booking updated successfully" });
  } catch (error) {
    console.error("Error updating service booking:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ===============================================
// 📌 Get Bookings By User
// ===============================================
exports.getServiceBookingsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const [rows] = await global.db.query(
      "SELECT * FROM service_bookings WHERE userId = ? ORDER BY createdAt DESC",
      [userId]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching service bookings for user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ===============================================
// 📌 Get Bookings By Service Provider
// ===============================================
exports.getBookingsByService = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const [rows] = await global.db.query(
      "SELECT * FROM service_bookings WHERE serviceId = ? ORDER BY createdAt DESC",
      [serviceId]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching bookings by serviceId:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
