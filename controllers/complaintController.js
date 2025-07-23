const jwt = require('jsonwebtoken');

// Middleware: Authenticate JWT
exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// POST Complaint
exports.postComplaint = async (req, res) => {
  const { subject, description, location, gallery } = req.body;
  const userId = req.user.id;

  if (!subject || !description || !location) {
    return res.status(400).json({ message: 'Subject, description, and location are required' });
  }

  try {
    await global.db.query(
      `INSERT INTO complaints (userId, subject, description, location, gallery)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, subject, description, location, JSON.stringify(gallery || [])]
    );

    const [userRows] = await global.db.query(
      `SELECT id AS userId, name, phone, email FROM users WHERE id = ?`,
      [userId]
    );

    res.json({ message: 'Complaint submitted successfully', user: userRows[0] });
  } catch (err) {
    console.error('❌ Error posting complaint:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET All Complaints (admin/general use)
exports.getAllComplaints = async (req, res) => {
  try {
    const [rows] = await global.db.query(`
      SELECT c.*, u.name, u.email, u.phone
      FROM complaints c
      JOIN users u ON c.userId = u.id
      ORDER BY c.createdAt DESC
    `);

    res.json({ complaints: rows });
  } catch (err) {
    console.error('❌ Error fetching complaints:', err);
    res.status(500).json({ message: 'Error fetching complaints' });
  }
};

// GET Complaints by logged-in user (JWT)
exports.getUserComplaints = async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await global.db.query(`
      SELECT id, subject, description, location, gallery, status, createdAt
      FROM complaints
      WHERE userId = ?
      ORDER BY createdAt DESC
    `, [userId]);

    res.json({ complaints: rows });
  } catch (err) {
    console.error('❌ Error fetching user complaints:', err);
    res.status(500).json({ message: 'Error fetching user complaints' });
  }
};


// PUT: Update complaint by ID (only by owner)
exports.updateComplaint = async (req, res) => {
  const userId = req.user.id;
  const complaintId = req.params.id;
  const { subject, description, location, gallery } = req.body;

  try {
    // Check ownership
    const [existing] = await global.db.query(
      `SELECT id FROM complaints WHERE id = ? AND userId = ?`,
      [complaintId, userId]
    );
    if (existing.length === 0) {
      return res.status(403).json({ message: 'Unauthorized or complaint not found' });
    }

    await global.db.query(
      `UPDATE complaints
       SET subject = ?, description = ?, location = ?, gallery = ?
       WHERE id = ? AND userId = ?`,
      [subject, description, location, JSON.stringify(gallery || []), complaintId, userId]
    );

    res.json({ message: 'Complaint updated successfully' });
  } catch (err) {
    console.error('❌ Error updating complaint:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE: Delete complaint by ID (only by owner)
exports.deleteComplaint = async (req, res) => {
  const userId = req.user.id;
  const complaintId = req.params.id;

  try {
    // Check ownership
    const [existing] = await global.db.query(
      `SELECT id FROM complaints WHERE id = ? AND userId = ?`,
      [complaintId, userId]
    );
    if (existing.length === 0) {
      return res.status(403).json({ message: 'Unauthorized or complaint not found' });
    }

    await global.db.query(`DELETE FROM complaints WHERE id = ? AND userId = ?`, [complaintId, userId]);

    res.json({ message: 'Complaint deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting complaint:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
