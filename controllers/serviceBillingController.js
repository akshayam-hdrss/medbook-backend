const db = global.db;

// add date and time in service_billing table automatically  not by user and body

exports.createBill = async (req, res) => {
  try {
    const {
      bookingId,
      serviceId,
      userId,
      items,
      tax,
      subTotal,
      total,
      customerName,
      contactNumber
    } = req.body;

    if (!serviceId || !subTotal || !total || !items || !customerName || !contactNumber) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const date = new Date();
    const time = date.toTimeString();


    const taxAmount = tax || 0;
    // const total = subTotal + taxAmount;

    const sql = `
      INSERT INTO service_billing
      (bookingId, serviceId, userId, subTotal, tax, total, items, customerName, contactNumber , date, time)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      bookingId,
      serviceId,
      userId,
      subTotal,
      taxAmount,
      total,
      JSON.stringify(items),
      customerName,
      contactNumber,
      date,
      time
    ]);

    let message = "Bill created successfully";

    if (bookingId) {
      const updateBookingSql = `
        UPDATE service_bookings
        SET billingId = ?
        WHERE id = ?
      `;
      const updateBookingResult = await db.query(updateBookingSql, [result.insertId, bookingId]);
      message = "Billing updated successfully";
    }

    res.status(201).json({
      result: "Success",
      message,
      subTotal,
      tax: taxAmount,
      total,
      customerName,
      contactNumber,
      date,
      time
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ result: "Failed", message: "Server error" });
  }
};

exports.getBillingByServiceId = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const [rows] = await db.query(
      `SELECT * FROM service_billing WHERE serviceId = ? ORDER BY createdAt DESC`,
      [serviceId]
    );

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getBillingByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const [rows] = await db.query(
      `SELECT * FROM service_billing WHERE userId = ? ORDER BY createdAt DESC`,
      [userId]
    );

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.updateBillingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus, paymentMethod } = req.body;

    if (!paymentStatus) {
      return res.status(400).json({ message: "paymentStatus is required" });
    }

    await db.query(
      `UPDATE service_billing 
       SET paymentStatus = ?, paymentMethod = ?
       WHERE id = ?`,
      [paymentStatus, paymentMethod || null, id]
    );

    res.json({ message: "Billing status updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getBillingByBookingId = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const [rows] = await db.query(
      `SELECT * FROM service_billing WHERE bookingId = ? ORDER BY createdAt DESC`,
      [bookingId]
    );

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
