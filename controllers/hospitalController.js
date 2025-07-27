const db = global.db;

exports.getAllHospitalTypes = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM hospitalType');

    const hospitalTypes = rows.map((row) => ({
      id: row.id,
      name: row.name,
      imageUrl: row.imageUrl || ""
    }));

    res.json({ result: "Success", resultData: hospitalTypes });
  } catch (error) {
    res.status(500).json({ result: "Failed", message: error.message });
  }
};

exports.addHospitalType = async (req, res) => {
  try {
    const { name, imageUrl } = req.body;
    const [result] = await db.query(
      'INSERT INTO hospitalType (name, imageUrl) VALUES (?, ?)',
      [name, imageUrl]
    );
    res.json({
      result: "Success",
      message: "Hospital type added",
      resultData: { id: result.insertId, name, imageUrl: imageUrl || "" }
    });
  } catch (error) {
    res.status(500).json({ result: "Failed", message: error.message });
  }
};

exports.updateHospitalType = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, imageUrl } = req.body;
    await db.query(
      'UPDATE hospitalType SET name = ?, imageUrl = ? WHERE id = ?',
      [name, imageUrl, id]
    );
    res.json({ result: "Success", message: "Hospital type updated" });
  } catch (error) {
    res.status(500).json({ result: "Failed", message: error.message });
  }
};

exports.deleteHospitalType = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM hospitalType WHERE id = ?', [id]);
    res.json({ result: "Success", message: "Hospital type deleted" });
  } catch (error) {
    res.status(500).json({ result: "Failed", message: error.message });
  }
};

exports.getAllHospitals = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM hospital');

    const hospitals = rows.map((row) => ({
      id: row.id,
      name: row.name,
      imageUrl: row.imageUrl || "",
      area: row.area || "",
      mapLink: row.mapLink || "",
      phone: row.phone || "",
      hospitalTypeId: row.hospitalTypeId,
      address1: row.address1 || "",
      address2: row.address2 || "",
      district: row.district || "",
      pincode: row.pincode || ""
    }));

    res.json({ result: "Success", resultData: hospitals });
  } catch (error) {
    res.status(500).json({ result: "Failed", message: error.message });
  }
};

exports.getHospitalsByType = async (req, res) => {
  try {
    const { hospitalTypeId } = req.params;
    const { district, area } = req.query;

    let query = 'SELECT * FROM hospital WHERE hospitalTypeId = ?';
    const params = [hospitalTypeId];

    if (district) {
      query += ' AND district = ?';
      params.push(district);
    }

    if (area) {
      query += ' AND area = ?';
      params.push(area);
    }

    const [rows] = await db.query(query, params);

    const hospitals = rows.map((row) => ({
      id: row.id,
      name: row.name,
      imageUrl: row.imageUrl || "",
      area: row.area || "",
      mapLink: row.mapLink || "",
      phone: row.phone || "",
      hospitalTypeId: row.hospitalTypeId,
      address1: row.address1 || "",
      address2: row.address2 || "",
      district: row.district || "",
      pincode: row.pincode || ""
    }));

    res.json({ result: "Success", resultData: hospitals });
  } catch (error) {
    res.status(500).json({ result: "Failed", message: error.message });
  }
};


exports.addHospital = async (req, res) => {
  try {
    const { name, imageUrl, area, mapLink, phone, hospitalTypeId, address1, address2, district, pincode } = req.body;

    if (!name || !hospitalTypeId) {
      return res.status(400).json({
        result: "Failed",
        message: "Missing required fields: 'name' and 'hospitalTypeId' are required."
      });
    }

    const [result] = await db.query(
      `INSERT INTO hospital 
      (name, imageUrl, area, mapLink, phone, hospitalTypeId, address1, address2, district, pincode) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, imageUrl, area, mapLink, phone, hospitalTypeId, address1, address2, district, pincode]
    );

    res.json({
      result: "Success",
      message: "Hospital added",
      resultData: {
        id: result.insertId,
        name,
        imageUrl: imageUrl || "",
        area: area || "",
        mapLink: mapLink || "",
        phone: phone || "",
        hospitalTypeId,
        address1: address1 || "",
        address2: address2 || "",
        district: district || "",
        pincode: pincode || ""
      }
    });
  } catch (error) {
    res.status(500).json({ result: "Failed", message: error.message });
  }
};


exports.updateHospital = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, imageUrl, area, mapLink, phone, hospitalTypeId, address1, address2, district, pincode } = req.body;

    if (!name || !hospitalTypeId) {
      return res.status(400).json({
        result: "Failed",
        message: "Missing required fields: 'name' and 'hospitalTypeId' are required."
      });
    }

    await db.query(
      `UPDATE hospital 
      SET name = ?, imageUrl = ?, area = ?, mapLink = ?, phone = ?, hospitalTypeId = ?, 
          address1 = ?, address2 = ?, district = ?, pincode = ?
      WHERE id = ?`,
      [name, imageUrl, area, mapLink, phone, hospitalTypeId, address1, address2, district, pincode, id]
    );

    res.json({ result: "Success", message: "Hospital updated" });
  } catch (error) {
    res.status(500).json({ result: "Failed", message: error.message });
  }
};


exports.deleteHospital = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM hospital WHERE id = ?', [id]);
    res.json({ result: "Success", message: "Hospital deleted" });
  } catch (error) {
    res.status(500).json({ result: "Failed", message: error.message });
  }
};
