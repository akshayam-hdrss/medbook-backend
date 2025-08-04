const db = global.db;

// Get all doctor types
exports.getAllDoctorTypes = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name, imageUrl, order_no FROM doctorType');
    const formatted = rows.map(row => ({
      id: row.id,
      name: row.name,
      imageUrl: row.imageUrl || "",
      order_no: row.order_no
    }));
    res.json({ result: "Success", resultData: formatted });
  } catch (error) {
    res.status(500).json({ result: "Failed", message: error.message });
  }
};

// Add a doctor type
exports.addDoctorType = async (req, res) => {
  try {
    const { name, imageUrl, order_no } = req.body;
    const [result] = await db.query(
      'INSERT INTO doctorType (name, imageUrl, order_no) VALUES (?, ?, ?)',
      [name, imageUrl, order_no]
    );
    res.json({
      result: "Success",
      message: "Doctor type added",
      resultData: { id: result.insertId, name, imageUrl, order_no }
    });
  } catch (error) {
    res.status(500).json({ result: "Failed", message: error.message });
  }
};

// Update a doctor type
exports.updateDoctorType = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, imageUrl, order_no } = req.body;
    await db.query(
      'UPDATE doctorType SET name = ?, imageUrl = ?, order_no = ? WHERE id = ?',
      [name, imageUrl,order_no, id]
    );
    res.json({ result: "Success", message: "Doctor type updated" });
  } catch (error) {
    res.status(500).json({ result: "Failed", message: error.message });
  }
};

// Delete a doctor type
exports.deleteDoctorType = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM doctorType WHERE id = ?', [id]);
    res.json({ result: "Success", message: "Doctor type deleted" });
  } catch (error) {
    res.status(500).json({ result: "Failed", message: error.message });
  }
};
