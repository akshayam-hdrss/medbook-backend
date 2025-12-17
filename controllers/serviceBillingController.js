const db = global.db;

exports.createBill = async (req, res) => {
  try {
    const {
      bookingId,
      serviceId,
      userId,
      items,
      tax
    } = req.body;

    if (!bookingId || !serviceId || !userId || !items) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Calculate subtotal
    let subTotal = 0;
    items.forEach(item => {
      subTotal += item.price * item.quantity;
    });

    const taxAmount = tax || 0;
    const total = subTotal + taxAmount;

    const sql = `
      INSERT INTO service_billing
      (bookingId, serviceId, userId, subTotal, tax, total, items)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    await db.query(sql, [
      bookingId,
      serviceId,
      userId,
      subTotal,
      taxAmount,
      total,
      JSON.stringify(items)
    ]);

    res.status(201).json({
      message: "Bill created successfully",
      subTotal,
      tax: taxAmount,
      total
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
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
