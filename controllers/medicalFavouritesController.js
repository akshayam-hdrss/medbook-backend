// controllers/medicalFavouritesController.js
// ✅ Add Favourite


// ✅ Add Favourite (prevent duplicates)
exports.addFavourite = async (req, res) => {
  const db = global.db;
  try {
    const { doctorId, serviceId } = req.body;

    if (!doctorId || !serviceId)
      return res.status(400).json({ message: "doctorId and serviceId are required" });

    // 🔍 Check if already exists
    const [existing] = await db.query(
      "SELECT * FROM medicalFavourites WHERE doctorId = ? AND serviceId = ?",
      [doctorId, serviceId]
    );

    if (existing.length > 0) {
      return res.status(200).json({
        message: "Already in favourites",
        id: existing[0].id,
        doctorId,
        serviceId,
        createdAt: existing[0].createdAt,
      });
    }

    // 🆕 Insert new favourite
    const [result] = await db.query(
      "INSERT INTO medicalFavourites (doctorId, serviceId) VALUES (?, ?)",
      [doctorId, serviceId]
    );

    // ✅ Return new inserted record with id
    const [rows] = await db.query("SELECT * FROM medicalFavourites WHERE id = ?", [
      result.insertId,
    ]);

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("❌ Error adding favourite:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ Get all favourites by doctorId
exports.getFavouritesByDoctor = async (req, res) => {
  const db = global.db;
  try {
    const { doctorId } = req.params;

    if (!doctorId) {
      return res.status(400).json({ message: "doctorId is required" });
    }

    const [rows] = await db.query(
      "SELECT * FROM medicalFavourites WHERE doctorId = ?",
      [doctorId]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error("❌ Error fetching favourites:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ Delete Favourite by ID
exports.deleteFavourite = async (req, res) => {
  const db = global.db;
  try {
    const { id } = req.params;

    if (!id)
      return res.status(400).json({ message: "id is required" });

    const [result] = await db.query(
      "DELETE FROM medicalFavourites WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Favourite not found" });

    res.json({ message: "Removed from favourites" });
  } catch (error) {
    console.error("❌ Error deleting favourite:", error);
    res.status(500).json({ message: "Server error" });
 }
};