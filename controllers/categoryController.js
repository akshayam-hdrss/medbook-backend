const db = global.db;

// Create new category
exports.addCategory = async (req, res) => {
  try {
    const { text, hospitalId, traditionalId, number } = req.body;

    if (!text) {
      return res.status(400).json({ result: "Failed", message: "Text is required" });
    }

    if (!hospitalId && !traditionalId) {
      return res.status(400).json({ 
        result: "Failed", 
        message: "Either hospitalId or traditionalId is required" 
      });
    }

    await db.query(
      "INSERT INTO category (text, hospitalId, traditionalId, number) VALUES (?, ?, ?, ?)",
      [text, hospitalId || null, traditionalId || null, number || 1]
    );

    res.json({ result: "Success", message: "Category added successfully" });
  } catch (error) {
    res.status(500).json({ result: "Failed", message: error.message });
  }
};

// Update category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, hospitalId, traditionalId, number } = req.body;

    if (!text) {
      return res.status(400).json({ result: "Failed", message: "Text is required" });
    }

    if (!hospitalId && !traditionalId) {
      return res.status(400).json({ 
        result: "Failed", 
        message: "Either hospitalId or traditionalId is required" 
      });
    }

    await db.query(
      "UPDATE category SET text = ?, hospitalId = ?, traditionalId = ?, number = ? WHERE id = ?",
      [text, hospitalId || null, traditionalId || null, number || 1, id]
    );

    res.json({ result: "Success", message: "Category updated successfully" });
  } catch (error) {
    res.status(500).json({ result: "Failed", message: error.message });
  }
};

// Get all categories (unchanged)
exports.getCategories = async (req, res) => {
  try {
    const [categories] = await db.query(`
      SELECT c.*, 
             h.name AS hospitalName,
             t.name AS traditionalName
      FROM category c
      LEFT JOIN hospital h ON c.hospitalId = h.id
      LEFT JOIN traditional t ON c.traditionalId = t.id
    `);
    res.json({ result: "Success", data: categories });
  } catch (error) {
    res.status(500).json({ result: "Failed", message: error.message });
  }
};

// Get single category (unchanged)
exports.getCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const [category] = await db.query(`
      SELECT c.*, 
             h.name AS hospitalName,
             t.name AS traditionalName
      FROM category c
      LEFT JOIN hospital h ON c.hospitalId = h.id
      LEFT JOIN traditional t ON c.traditionalId = t.id
      WHERE c.id = ?
    `, [id]);

    if (category.length === 0) {
      return res.status(404).json({ result: "Failed", message: "Category not found" });
    }

    res.json({ result: "Success", data: category[0] });
  } catch (error) {
    res.status(500).json({ result: "Failed", message: error.message });
  }
};

// Delete category (unchanged)
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM category WHERE id = ?", [id]);
    res.json({ result: "Success", message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ result: "Failed", message: error.message });
  }
};