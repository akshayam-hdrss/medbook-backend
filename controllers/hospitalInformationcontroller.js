const db = global.db;

// CREATE

exports.createHospitalInformation = async (req, res) => {
  try {
    const {
      hospitalId,
      bedCount,
      emergencyServices,
      specialties,
      establishedYear,
      website,
      description,
    } = req.body;

    // ✅ Check hospital existence
    const [hospitalRows] = await db.query("SELECT id FROM hospital WHERE id = ?", [hospitalId]);
    if (hospitalRows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid hospitalId. Hospital does not exist.",
      });
    }

    const [result] = await db.query(
      `INSERT INTO hospitalInformation 
        (hospitalId, bedCount, emergencyServices, specialties, establishedYear, website, description)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [hospitalId, bedCount, emergencyServices, specialties, establishedYear, website, description]
    );

    res.status(201).json({
      success: true,
      message: "Hospital information created successfully",
      data: { id: result.insertId, ...req.body },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to create hospital information" });
  }
};


// READ ALL
exports.getAllHospitalInformation = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT hi.*, h.name AS hospitalName 
       FROM hospitalInformation hi
       JOIN hospital h ON hi.hospitalId = h.id`
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch hospital information" });
  }
};

// READ ONE (filter by hospitalId)
exports.getHospitalInformationByHospitalId = async (req, res) => {
  try {
    const { hospitalId } = req.params;
    const [rows] = await db.query(
      `SELECT hi.*, h.name AS hospitalName 
       FROM hospitalInformation hi
       JOIN hospital h ON hi.hospitalId = h.id
       WHERE hi.hospitalId = ?`,
      [hospitalId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Hospital Information not found" });
    }

    res.json({ success: true, data: rows[0] }); // if you expect multiple, send rows instead of rows[0]
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch hospital information" });
  }
};

// UPDATE
// UPDATE (by hospitalId)
exports.updateHospitalInformationByHospitalId = async (req, res) => {
  try {
    const { hospitalId } = req.params;
    const {
      bedCount,
      emergencyServices,
      specialties,
      establishedYear,
      website,
      description,
    } = req.body;

    // ✅ Check hospital existence
    const [hospitalRows] = await db.query("SELECT id FROM hospital WHERE id = ?", [hospitalId]);
    if (hospitalRows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid hospitalId. Hospital does not exist.",
      });
    }

    const [result] = await db.query(
      `UPDATE hospitalInformation 
       SET bedCount = ?, emergencyServices = ?, specialties = ?, establishedYear = ?, website = ?, description = ?
       WHERE hospitalId = ?`,
      [bedCount, emergencyServices, specialties, establishedYear, website, description, hospitalId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Hospital Information not found" });
    }

    res.json({ success: true, message: "Hospital information updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update hospital information" });
  }
};



// DELETE
exports.deleteHospitalInformation = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query(`DELETE FROM hospitalInformation WHERE id = ?, [id]`);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Hospital Information not found" });
    }

    res.json({ success: true, message: "Hospital information deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to delete hospital information" });
  }
};