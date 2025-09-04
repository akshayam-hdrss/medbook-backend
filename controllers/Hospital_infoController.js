global.db;

// Add single hospital
exports.addHospital = async (req, res) => {
  const data = req.body;
  try {
    const sql = `INSERT INTO hospital_info
      (name, banner_image_url, journey_text, mission_text)
      VALUES (?,?,?,?)`;

    const values = [
      data.name || null,
      data.banner_image_url || null,
      data.journey_text || null,
      data.mission_text || null
    ];

    const [result] = await db.query(sql, values);
    res.json({ message: 'Hospital added successfully', id: result.insertId });
  } catch (err) {
    console.error("MySQL Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Edit hospital
exports.editHospital = async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  try {
    const sql = `UPDATE hospital_info SET 
      name=?, banner_image_url=?, journey_text=?, mission_text=?
      WHERE id=?`;

    const values = [
      data.name || null,
      data.banner_image_url || null,
      data.journey_text || null,
      data.mission_text || null,
      id
    ];

    const [result] = await db.query(sql, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Hospital not found" });
    }
    res.json({ message: 'Hospital updated successfully' });
  } catch (err) {
    console.error("MySQL Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Delete hospital
exports.deleteHospital = async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await db.query(`DELETE FROM hospital_info WHERE id=?, [id]`);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Hospital not found" });
    }
    res.json({ message: 'Hospital deleted successfully' });
  } catch (err) {
    console.error("MySQL Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Get all hospitals
exports.getHospital = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM hospital_info');
    res.json(rows);
  } catch (err) {
    console.error("MySQL Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};