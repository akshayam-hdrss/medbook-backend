const express = require('express');
const router = express.Router();

// Create blog post
router.post('/blog', async (req, res) => {
  try {
    const {
      title, content, author, publishedDate,
      status, category, featuredImage, createdAt
    } = req.body;

    const [result] = await global.db.query(
      `INSERT INTO blog 
        (title, content, author, publishedDate, status, category, featuredImage, createdAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, content, author, publishedDate, status, category, featuredImage, createdAt]
    );

    res.status(201).json({ result: "Success", message: "Blog post created", id: result.insertId });
  } catch (error) {
    console.error("Error creating blog post:", error);
    res.status(500).json({ result: "Failed", message: error.message });
  }
});

// Get all blogs
router.get('/blog', async (req, res) => {
  try {
    const [rows] = await global.db.query(`SELECT * FROM blog ORDER BY createdAt DESC`);
    res.json({ result: "Success", data: rows });
  } catch (error) {
    res.status(500).json({ result: "Failed", message: error.message });
  }
});

// Get single blog by ID
router.get('/blog/:id', async (req, res) => {
  try {
    const [rows] = await global.db.query(`SELECT * FROM blog WHERE id = ?`, [req.params.id]);
    if (rows.length === 0)
      return res.status(404).json({ result: "Failed", message: "Blog not found" });

    res.json({ result: "Success", data: rows[0] });
  } catch (error) {
    res.status(500).json({ result: "Failed", message: error.message });
  }
});

// Update blog post
router.put('/blog/:id', async (req, res) => {
  try {
    const {
      title, content, author, publishedDate,
      status, category, featuredImage, createdAt
    } = req.body;

    const [result] = await global.db.query(
      `UPDATE blog SET 
        title = ?, content = ?, author = ?, publishedDate = ?, 
        status = ?, category = ?, featuredImage = ?, createdAt = ?
       WHERE id = ?`,
      [title, content, author, publishedDate, status, category, featuredImage, createdAt, req.params.id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ result: "Failed", message: "Blog not found" });

    res.json({ result: "Success", message: "Blog post updated successfully" });
  } catch (error) {
    console.error("Error updating blog post:", error);
    res.status(500).json({ result: "Failed", message: error.message });
  }
});

// Delete blog post
router.delete('/blog/:id', async (req, res) => {
  try {
    const [result] = await global.db.query(
      `DELETE FROM blog WHERE id = ?`, [req.params.id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ result: "Failed", message: "Blog not found" });

    res.json({ result: "Success", message: "Blog post deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    res.status(500).json({ result: "Failed", message: error.message });
  }
});

module.exports = router;
