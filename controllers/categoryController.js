const db = global.db;

// Create new category
exports.addCategory = async (req, res) => {
  try {
    const { text, hospitalId, number } = req.body;

    if (!text || !hospitalId) {
      return res.status(400).json({ result: "Failed", message: "Missing required fields" });
    }

    await db.query(
      "INSERT INTO category (text, hospitalId, number) VALUES (?, ?, ?)",
      [text, hospitalId, number]
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
    const { text, number } = req.body;

    if (!text) {
      return res.status(400).json({ result: "Failed", message: "Text is required" });
    }

    await db.query(
      "UPDATE category SET text = ?, number = ? WHERE id = ?",
      [text, number, id]
    );

    res.json({ result: "Success", message: "Category updated successfully" });
  } catch (error) {
    res.status(500).json({ result: "Failed", message: error.message });
  }
};



// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM category WHERE id = ?", [id]);

    res.json({ result: "Success", message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ result: "Failed", message: error.message });
  }
};
