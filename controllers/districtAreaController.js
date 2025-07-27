const db = global.db;

// Get all records
exports.getAll = async (req, res) => {
  const [rows] = await db.query("SELECT * FROM district_area ORDER BY order_no ASC");
  res.json(rows);
};

// Create new record
exports.create = async (req, res) => {
  const { order_no, district, area } = req.body;
  await db.query("INSERT INTO district_area (order_no, district, area) VALUES (?, ?, ?)", [order_no, district, area]);
  res.json({ message: 'Record added successfully' });
};

// Update record
exports.update = async (req, res) => {
  const { id } = req.params;
  const { order_no, district, area } = req.body;
  await db.query("UPDATE district_area SET order_no = ?, district = ?, area = ? WHERE id = ?", [order_no, district, area, id]);
  res.json({ message: 'Record updated successfully' });
};

// Delete record
exports.delete = async (req, res) => {
  const { id } = req.params;
  await db.query("DELETE FROM district_area WHERE id = ?", [id]);
  res.json({ message: 'Record deleted successfully' });
};
