const db = global.db;

// ➤ Add a favorite
exports.addFavorite = async (req, res) => {
  try {
    const { userId, doctorId, serviceId, productId } = req.body;

    const [result] = await db.query(
      `INSERT INTO favorites (userId, doctorId, serviceId, productId)
       VALUES (?, ?, ?, ?)`,
      [userId, doctorId, serviceId, productId]
    );

    res
      .status(201)
      .json({ message: "Favorite added successfully", id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ➤ Get all favorites for a user
exports.getFavoritesByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const [favorites] = await db.query(
      `SELECT * FROM favorites WHERE userId = ?`,
      [userId]
    );

    res.status(200).json(favorites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ➤ Update favorite
exports.updateFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const { doctorId, serviceId, productId } = req.body;

    await db.query(
      `UPDATE favorites
       SET doctorId = ?, serviceId = ?, productId = ?
       WHERE id = ?`,
      [doctorId, serviceId, productId, id]
    );

    res.status(200).json({ message: "Favorite updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ➤ Delete favorite
exports.deleteFavorite = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(`DELETE FROM favorites WHERE id = ?`, [id]);

    res.status(200).json({ message: "Favorite deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
