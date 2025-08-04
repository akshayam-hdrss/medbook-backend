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
    const { name, imageUrl, order_no } = req.body;
    const [result] = await db.query(
      'INSERT INTO availableProduct (name, imageUrl, order_no) VALUES (?, ?, ?)',
      [name, imageUrl, order_no || null]
    );
    res.json({ result: "Success", resultData: { id: result.insertId, name, imageUrl, order_no } });
  } catch (err) {
    res.status(500).json({ result: "Failed", message: err.message });
  }
};

exports.updateAvailableProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, imageUrl, order_no } = req.body;
    await db.query('UPDATE availableProduct SET name = ?, imageUrl = ?, order_no = ? WHERE id = ?', [name, imageUrl, order_no, id]);
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
    const { name, imageUrl, order_no, availableProductId } = req.body;
    const [result] = await db.query(
      'INSERT INTO productType (name, imageUrl, order_no, availableProductId) VALUES (?, ?, ?, ?)',
      [name, imageUrl, order_no, availableProductId]
    );
    res.json({ result: "Success", resultData: { id: result.insertId, name, imageUrl,order_no, availableProductId } });
  } catch (err) {
    res.status(500).json({ result: "Failed", message: err.message });
  }
};

exports.updateProductType = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, imageUrl, order_no, availableProductId } = req.body;
    await db.query(
      'UPDATE productType SET name = ?, imageUrl = ?, order_no = ?, availableProductId = ? WHERE id = ?',
      [name, imageUrl, order_no, availableProductId, id]
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


// ------------ PRODUCT ------------

// Add product
exports.addProduct = async (req, res) => {
  try {
    const {
      productName, price, imageUrl, businessName, location, phone,
      whatsapp, experience, addressLine1, addressLine2, mapLink,
      about, youtubeLink, gallery, bannerUrl, productTypeId,
      district, pincode, order_no
    } = req.body;

    if (!productName || !productTypeId) {
      return res.status(400).json({
        result: "Failed",
        message: "'productName' and 'productTypeId' are required"
      });
    }

    const [result] = await db.query(`
      INSERT INTO product (
        productName, price, imageUrl, businessName, location, phone, whatsapp,
        experience, addressLine1, addressLine2, mapLink, about, youtubeLink,
        gallery, bannerUrl, productTypeId, district, pincode, order_no
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      productName, price, imageUrl, businessName, location, phone, whatsapp,
      experience, addressLine1, addressLine2, mapLink, about, youtubeLink,
      JSON.stringify(gallery || []), bannerUrl, productTypeId, district, pincode, order_no
    ]);

    res.json({ result: "Success", message: "Product added", resultData: { id: result.insertId, productName } });
  } catch (err) {
    res.status(500).json({ result: "Failed", message: err.message });
  }
};

// Get products by productTypeId
exports.getProductsByProductTypeId = async (req, res) => {
  try {
    const { productTypeId } = req.params;
    const { location, district } = req.query; // Get from query params

    let sql = 'SELECT * FROM product WHERE productTypeId = ?';
    const params = [productTypeId];

    if (location) {
      sql += ' AND location = ?';
      params.push(location);
    }
    if (district) {
      sql += ' AND district = ?';
      params.push(district);
    }

    const [rows] = await db.query(sql, params);

    const products = rows.map(row => ({
      id: row.id,
      productName: row.productName,
      price: row.price,
      imageUrl: row.imageUrl || "",
      businessName: row.businessName || "",
      location: row.location || "",
      phone: row.phone || "",
      whatsapp: row.whatsapp || "",
      experience: row.experience || "",
      addressLine1: row.addressLine1 || "",
      addressLine2: row.addressLine2 || "",
      mapLink: row.mapLink || "",
      about: row.about || "",
      youtubeLink: row.youtubeLink || "",
      gallery: (() => {
        try {
          return row.gallery ? JSON.parse(row.gallery) : [];
        } catch (err) {
          return [];
        }
      })(),
      bannerUrl: row.bannerUrl || "",
      productTypeId: row.productTypeId,
      district: row.district || "",
      pincode: row.pincode || "",
      order_no: row.order_no || null
    }));

    res.json({ result: "Success", resultData: products });
  } catch (err) {
    res.status(500).json({ result: "Failed", message: err.message });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM product WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ result: "Failed", message: "Product not found" });
    }

    const row = rows[0];
    const product = {
      id: row.id,
      productName: row.productName,
      price: row.price,
      imageUrl: row.imageUrl || "",
      businessName: row.businessName || "",
      location: row.location || "",
      phone: row.phone || "",
      whatsapp: row.whatsapp || "",
      experience: row.experience || "",
      addressLine1: row.addressLine1 || "",
      addressLine2: row.addressLine2 || "",
      mapLink: row.mapLink || "",
      about: row.about || "",
      youtubeLink: row.youtubeLink || "",
      gallery: (() => {
        try {
          if (!row.gallery) return [];
          if (row.gallery.trim().startsWith('[')) {
            return JSON.parse(row.gallery);
          }
          return row.gallery.split(',').map(x => x.trim());
        } catch {
          return [];
        }
      })(),
      bannerUrl: row.bannerUrl || "",
      productTypeId: row.productTypeId,
      district: row.district || "",
      pincode: row.pincode || "" ,
      order_no: row.order_no || null
    };

    res.json({ result: "Success", resultData: product });
  } catch (err) {
    res.status(500).json({ result: "Failed", message: err.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      productName, price, imageUrl, businessName, location, phone,
      whatsapp, experience, addressLine1, addressLine2, mapLink,
      about, youtubeLink, gallery, bannerUrl, productTypeId,
      district, pincode, order_no
    } = req.body;

    if (!productName || !productTypeId) {
      return res.status(400).json({
        result: "Failed",
        message: "'productName' and 'productTypeId' are required"
      });
    }

    await db.query(`
      UPDATE product SET
        productName = ?, price = ?, imageUrl = ?, businessName = ?, location = ?,
        phone = ?, whatsapp = ?, experience = ?, addressLine1 = ?, addressLine2 = ?,
        mapLink = ?, about = ?, youtubeLink = ?, gallery = ?, bannerUrl = ?, productTypeId = ?,
        district = ?, pincode = ?, order_no = ?
      WHERE id = ?
    `, [
      productName, price, imageUrl, businessName, location, phone, whatsapp,
      experience, addressLine1, addressLine2, mapLink, about, youtubeLink,
      JSON.stringify(gallery || []), bannerUrl, productTypeId, district, pincode, order_no, id
    ]);

    res.json({ result: "Success", message: "Product updated" });
  } catch (err) {
    res.status(500).json({ result: "Failed", message: err.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM product WHERE id = ?', [id]);
    res.json({ result: "Success", message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ result: "Failed", message: err.message });
  }
};
