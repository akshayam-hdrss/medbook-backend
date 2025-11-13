// ADD PRODUCT
const addMedicalProduct = async (req, res) => {
  const db = global.db;
  const { doctorId, productName, price, category } = req.body;

  try {
    await db.query(
      `INSERT INTO medicalProduct (doctorId, productName, price, category) VALUES (?, ?, ?, ?)`,
      [doctorId, productName, price || 0.0, category || null]
    );

    res.status(200).json({ message: "Product added ✅" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add product" });
  }
};

// GET PRODUCTS BY DOCTOR
const getMedicalProductsByDoctor = async (req, res) => {
  const db = global.db;
  const { doctorId } = req.params;

  try {
    const [results] = await db.query(
      `SELECT id, doctorId, productName, price, category, createdAt 
       FROM medicalProduct 
       WHERE doctorId = ? 
       ORDER BY createdAt DESC`,
      [doctorId]
    );

    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// UPDATE PRODUCT
const updateMedicalProduct = async (req, res) => {
  const db = global.db;
  const { id } = req.params;
  const { productName, price, category } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE medicalProduct 
       SET productName = ?, price = ?, category = ? 
       WHERE id = ?`,
      [productName, price || 0.0, category || null, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product updated ✅" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update product" });
  }
};

// DELETE PRODUCT
const deleteMedicalProduct = async (req, res) => {
  const db = global.db;
  const { id } = req.params;

  try {
    const [result] = await db.query(`DELETE FROM medicalProduct WHERE id = ?`, [
      id,
    ]);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product deleted ✅" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete product" });
  }
};

module.exports = {
  addMedicalProduct,
  getMedicalProductsByDoctor,
  updateMedicalProduct,
  deleteMedicalProduct,
};
