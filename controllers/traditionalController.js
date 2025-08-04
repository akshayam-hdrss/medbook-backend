const db = global.db;

exports.getAllTraditionalTypes = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM traditionalType');

    const traditionalTypes = rows.map((row) => ({
      id: row.id,
      name: row.name,
      imageUrl: row.imageUrl || "",
      order_no: row.order_no
    }));

    res.json({ result: "Success", resultData: traditionalTypes });
  } catch (error) {
    res.status(500).json({ result: "Failed", message: error.message });
  }
};

exports.addTraditionalType = async (req, res) => {
  try {
    const { name, imageUrl, order_no } = req.body;
    const [result] = await db.query(
      'INSERT INTO traditionalType (name, imageUrl, order_no) VALUES (?, ?, ?)',
      [name, imageUrl, order_no]
    );
    res.json({
      result: "Success",
      message: "Traditional type added",
      resultData: { id: result.insertId, name, imageUrl: imageUrl || "" , order_no: order_no || null }
    });
  } catch (error) {
    res.status(500).json({ result: "Failed", message: error.message });
  }
};

exports.updateTraditionalType = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, imageUrl } = req.body;
    await db.query(
      'UPDATE traditionalType SET name = ?, imageUrl = ?, order_no = ? WHERE id = ?',
      [name, imageUrl, order_no, id]
    );
    res.json({ result: "Success", message: "Traditional type updated" });
  } catch (error) {
    res.status(500).json({ result: "Failed", message: error.message });
  }
};

exports.deleteTraditionalType = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM traditionalType WHERE id = ?', [id]);
    res.json({ result: "Success", message: "Traditional type deleted" });
  } catch (error) {
    res.status(500).json({ result: "Failed", message: error.message });
  }
};

exports.getAllTraditionals = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM traditional');

    const traditionals = rows.map((row) => ({
      id: row.id,
      name: row.name,
      imageUrl: row.imageUrl || "",
      area: row.area || "",
      mapLink: row.mapLink || "",
      phone: row.phone || "",
      traditionalTypeId: row.traditionalTypeId,
      address1: row.address1 || "",
      address2: row.address2 || "",
      district: row.district || "",
      pincode: row.pincode || "",
      order_no: row.order_no || null
    }));

    res.json({ result: "Success", resultData: traditionals });
  } catch (error) {
    res.status(500).json({ result: "Failed", message: error.message });
  }
};

exports.getTraditionalsByType = async (req, res) => {
  try {
    const { traditionalTypeId } = req.params;
    const { district, area } = req.query;

    let query = 'SELECT * FROM traditional WHERE traditionalTypeId = ?';
    const params = [traditionalTypeId];

    if (district) {
      query += ' AND district = ?';
      params.push(district);
    }

    if (area) {
      query += ' AND area = ?';
      params.push(area);
    }

    const [rows] = await db.query(query, params);

    const traditionals = rows.map((row) => ({
      id: row.id,
      name: row.name,
      imageUrl: row.imageUrl || "",
      area: row.area || "",
      mapLink: row.mapLink || "",
      phone: row.phone || "",
      traditionalTypeId: row.traditionalTypeId,
      address1: row.address1 || "",
      address2: row.address2 || "",
      district: row.district || "",
      pincode: row.pincode || "",
      order_no: row.order_no || null
    }));

    res.json({ result: "Success", resultData: traditionals });
  } catch (error) {
    res.status(500).json({ result: "Failed", message: error.message });
  }
};

exports.addTraditional = async (req, res) => {
  try {
    const { name, imageUrl, area, mapLink, phone, traditionalTypeId, address1, address2, district, pincode, order_no } = req.body;

    if (!name || !traditionalTypeId) {
      return res.status(400).json({
        result: "Failed",
        message: "Missing required fields: 'name' and 'traditionalTypeId' are required."
      });
    }

    const [result] = await db.query(
      `INSERT INTO traditional 
      (name, imageUrl, area, mapLink, phone, traditionalTypeId, address1, address2, district, pincode, order_no) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, imageUrl, area, mapLink, phone, traditionalTypeId, address1, address2, district, pincode, order_no]
    );

    res.json({
      result: "Success",
      message: "Traditional added",
      resultData: {
        id: result.insertId,
        name,
        imageUrl: imageUrl || "",
        area: area || "",
        mapLink: mapLink || "",
        phone: phone || "",
        traditionalTypeId,
        address1: address1 || "",
        address2: address2 || "",
        district: district || "",
        pincode: pincode || "",
        order_no: order_no || null
      }
    });
  } catch (error) {
    res.status(500).json({ result: "Failed", message: error.message });
  }
};

exports.updateTraditional = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, imageUrl, area, mapLink, phone, traditionalTypeId, address1, address2, district, pincode, order_no } = req.body;

    if (!name || !traditionalTypeId) {
      return res.status(400).json({
        result: "Failed",
        message: "Missing required fields: 'name' and 'traditionalTypeId' are required."
      });
    }

    await db.query(
      `UPDATE traditional 
      SET name = ?, imageUrl = ?, area = ?, mapLink = ?, phone = ?, traditionalTypeId = ?, 
          address1 = ?, address2 = ?, district = ?, pincode = ?, order_no = ?
      WHERE id = ?`,
      [name, imageUrl, area, mapLink, phone, traditionalTypeId, address1, address2, district, pincode, order_no, id]
    );

    res.json({ result: "Success", message: "Traditional updated" });
  } catch (error) {
    res.status(500).json({ result: "Failed", message: error.message });
  }
};

exports.deleteTraditional = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM traditional WHERE id = ?', [id]);
    res.json({ result: "Success", message: "Traditional deleted" });
  } catch (error) {
    res.status(500).json({ result: "Failed", message: error.message });
  }
};