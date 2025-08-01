const db = global.db;

// POST: Add new icon
exports.createIcon = async (req, res) => {
  try {
    const { name, image } = req.body;
    if (!name || !image) {
      return res.status(400).json({ message: 'Name and image are required' });
    }

    const [result] = await db.query(
      'INSERT INTO primecareicon (name, image) VALUES (?, ?)',
      [name, image]
    );

    res.status(201).json({ message: 'Icon added', id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// GET: All icons
exports.getIcons = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM primecareicon');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// PUT: Update icon by ID
exports.updateIcon = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image } = req.body;
    if (!name || !image) {
      return res.status(400).json({ message: 'Name and image are required' });
    }

    const [result] = await db.query(
      'UPDATE primecareicon SET name = ?, image = ? WHERE id = ?',
      [name, image, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Icon not found' });
    }

    res.json({ message: 'Icon updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// DELETE: Delete icon by ID
exports.deleteIcon = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      'DELETE FROM primecareicon WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Icon not found' });
    }

    res.json({ message: 'Icon deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
