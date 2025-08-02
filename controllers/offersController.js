const db = global.db; // your db connection file

// Get all offers
exports.getAllOffers = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM offers');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get offer by ID
exports.getOfferById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM offers WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Offer not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new offer
exports.createOffer = async (req, res) => {
  try {
    const { name, gallery } = req.body;
    const galleryJson = JSON.stringify(gallery);
    const [result] = await db.query(
      'INSERT INTO offers (name, gallery) VALUES (?, ?)',
      [name, galleryJson]
    );
    res.status(201).json({ id: result.insertId, name, gallery });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update an offer
exports.updateOffer = async (req, res) => {
  try {
    const { name, gallery } = req.body;
    const galleryJson = JSON.stringify(gallery);
    const [result] = await db.query(
      'UPDATE offers SET name = ?, gallery = ? WHERE id = ?',
      [name, galleryJson, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Offer not found' });
    res.json({ message: 'Offer updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete an offer
exports.deleteOffer = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM offers WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Offer not found' });
    res.json({ message: 'Offer deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};