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
      hospitalTypeId: row.hospitalTypeId
    }));

    res.json({ result: "Success", resultData: hospitals });
  } catch (error) {
    res.status(500).json({ result: "Failed", message: error.message });
  }
};

exports.getHospitalsByType = async (req, res) => {
  try {
    const { hospitalTypeId } = req.params;
    const [rows] = await db.query(
      'SELECT * FROM hospital WHERE hospitalTypeId = ?',
      [hospitalTypeId]
    );

    const hospitals = rows.map((row) => ({
      id: row.id,
      name: row.name,
      imageUrl: row.imageUrl || "",
      area: row.area || "",
      mapLink: row.mapLink || "",
      phone: row.phone || "",
      hospitalTypeId: row.hospitalTypeId
    }));

    res.json({ result: "Success", resultData: hospitals });
  } catch (error) {
    res.status(500).json({ result: "Failed", message: error.message });
  }
};

exports.addHospital = async (req, res) => {
  try {
    const { name, imageUrl, area, mapLink, phone, hospitalTypeId } = req.body;

    // Validate
    if (!name || !hospitalTypeId) {
      return res.status(400).json({
        result: "Failed",
        message: "Missing required fields: 'name' and 'hospitalTypeId' are required."
      });
    }

    const [result] = await db.query(
      'INSERT INTO hospital (name, imageUrl, area, mapLink, phone, hospitalTypeId) VALUES (?, ?, ?, ?, ?, ?)',
      [name, imageUrl, area, mapLink, phone, hospitalTypeId]
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
        hospitalTypeId
      }
    });
  } catch (error) {
    res.status(500).json({ result: "Failed", message: error.message });
  }
};

exports.updateHospital = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, imageUrl, area, mapLink, phone, hospitalTypeId } = req.body;

    // Validate
    if (!name || !hospitalTypeId) {
      return res.status(400).json({
        result: "Failed",
        message: "Missing required fields: 'name' and 'hospitalTypeId' are required."
      });
    }

    await db.query(
      'UPDATE hospital SET name = ?, imageUrl = ?, area = ?, mapLink = ?, phone = ?, hospitalTypeId = ? WHERE id = ?',
      [name, imageUrl, area, mapLink, phone, hospitalTypeId, id]
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
