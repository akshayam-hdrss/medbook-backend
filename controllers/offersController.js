const db = global.db; // your db connection file

// Get all offers
exports.getAllOffers = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM offers');
    res.json({
      result: "Success",
      resultData: rows
    });
  } catch (err) {
    res.status(500).json({ result: "Error", error: err.message });
  }
};


// Get offer by ID
exports.getOfferById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM offers WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ result: "Error", message: 'Offer not found' });
    res.json({
      result: "Success",
      resultData: rows[0]
    });
  } catch (err) {
    res.status(500).json({ result: "Error", error: err.message });
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
    res.status(201).json({
      result: "Success",
      resultData: {
        id: result.insertId,
        name,
        gallery
      }
    });
  } catch (err) {
    res.status(500).json({ result: "Error", error: err.message });
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
    if (result.affectedRows === 0) return res.status(404).json({ result: "Error", message: 'Offer not found' });
    res.json({
      result: "Success",
      resultData: { message: 'Offer updated successfully' }
    });
  } catch (err) {
    res.status(500).json({ result: "Error", error: err.message });
  }
};


// Delete an offer
exports.deleteOffer = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM offers WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ result: "Error", message: 'Offer not found' });
    res.json({
      result: "Success",
      resultData: { message: 'Offer deleted successfully' }
    });
  } catch (err) {
    res.status(500).json({ result: "Error", error: err.message });
  }
};
