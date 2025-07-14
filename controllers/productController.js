const db = global.db;

// ------------ AVAILABLE PRODUCT ------------

exports.getAllAvailableProducts = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM availableProduct');
    res.json({ result: "Success", resultData: rows });
  } catch (err) {
    res.status(500).json({ result: "Failed", message: err.message });
  }
};

exports.addAvailableProduct = async (req, res) => {
  try {
    const { name, imageUrl } = req.body;
    const [result] = await db.query(
      'INSERT INTO availableProduct (name, imageUrl) VALUES (?, ?)',
      [name, imageUrl]
    );
    res.json({ result: "Success", resultData: { id: result.insertId, name, imageUrl } });
  } catch (err) {
    res.status(500).json({ result: "Failed", message: err.message });
  }
};

exports.updateAvailableProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, imageUrl } = req.body;
    await db.query('UPDATE availableProduct SET name = ?, imageUrl = ? WHERE id = ?', [name, imageUrl, id]);
    res.json({ result: "Success", message: "Updated" });
  } catch (err) {
    res.status(500).json({ result: "Failed", message: err.message });
  }
};

exports.deleteAvailableProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM availableProduct WHERE id = ?', [id]);
    res.json({ result: "Success", message: "Deleted" });
  } catch (err) {
    res.status(500).json({ result: "Failed", message: err.message });
  }
};

// ------------ PRODUCT TYPE ------------

exports.getAllProductTypes = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM productType');
    res.json({ result: "Success", resultData: rows });
  } catch (err) {
    res.status(500).json({ result: "Failed", message: err.message });
  }
};

exports.getProductTypesByAvailableProductId = async (req, res) => {
  try {
    const { availableProductId } = req.params;
    const [rows] = await db.query('SELECT * FROM productType WHERE availableProductId = ?', [availableProductId]);
    res.json({ result: "Success", resultData: rows });
  } catch (err) {
    res.status(500).json({ result: "Failed", message: err.message });
  }
};


exports.addProductType = async (req, res) => {
  try {
    const { name, imageUrl, availableProductId } = req.body;
    const [result] = await db.query(
      'INSERT INTO productType (name, imageUrl, availableProductId) VALUES (?, ?, ?)',
      [name, imageUrl, availableProductId]
    );
    res.json({ result: "Success", resultData: { id: result.insertId, name, imageUrl, availableProductId } });
  } catch (err) {
    res.status(500).json({ result: "Failed", message: err.message });
  }
};

exports.updateProductType = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, imageUrl, availableProductId } = req.body;
    await db.query(
      'UPDATE productType SET name = ?, imageUrl = ?, availableProductId = ? WHERE id = ?',
      [name, imageUrl, availableProductId, id]
    );
    res.json({ result: "Success", message: "Updated" });
  } catch (err) {
    res.status(500).json({ result: "Failed", message: err.message });
  }
};

exports.deleteProductType = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM productType WHERE id = ?', [id]);
    res.json({ result: "Success", message: "Deleted" });
  } catch (err) {
    res.status(500).json({ result: "Failed", message: err.message });
  }
};
