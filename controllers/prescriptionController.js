const createPrescription = async (req, res) => {
  const db = global.db;
  const {
    DoctorID,
    patientName,
    age,
    date,
    address,
    description,
    prescription,
    nextVisit
  } = req.body;

  try {
    // ✅ Get last prescription number for this doctor
    const [last] = await db.query(
      `SELECT prescriptionId FROM prescription WHERE DoctorID = ? ORDER BY prescriptionId DESC LIMIT 1`,
      [DoctorID]
    );

    const newPrescriptionId = last.length ? last[0].prescriptionId + 1 : 1;

    // ✅ Insert new prescription
    await db.query(
      `INSERT INTO prescription 
      (prescriptionId, DoctorID, patientName, age, date, address, description, prescription, nextVisit) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newPrescriptionId,
        DoctorID,
        patientName,
        age,
        date,
        address,
        description,
        JSON.stringify(prescription),
        nextVisit
      ]
    );

    res.status(200).json({ 
      message: "Prescription created ✅", 
      prescriptionId: newPrescriptionId 
    });
  } catch (err) {
    console.error("Error inserting prescription:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Get all prescriptions by DoctorID
const getPrescriptionsByDoctor = async (req, res) => {
  const db = global.db;
  const { DoctorID } = req.params;

  try {
    const [results] = await db.query(
      `SELECT * FROM prescription WHERE DoctorID = ? ORDER BY createdAt DESC`,
      [DoctorID]
    );
    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed fetching prescriptions" });
  }
};

// ✅ Get a single prescription (DoctorID + prescriptionId)
const getPrescription = async (req, res) => {
  const db = global.db;
  const { DoctorID, prescriptionId } = req.params;

  try {
    const [result] = await db.query(
      `SELECT * FROM prescription WHERE DoctorID = ? AND prescriptionId = ? LIMIT 1`,
      [DoctorID, prescriptionId]
    );

    if (!result.length)
      return res.status(404).json({ message: "Prescription not found" });

    res.status(200).json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed fetching prescription" });
  }
};

// ✅ Update a prescription
const updatePrescription = async (req, res) => {
  const db = global.db;
  const { DoctorID, prescriptionId } = req.params;
  const { patientName, age, date, address, description, prescription, nextVisit } = req.body;

  try {
    const [exist] = await db.query(
      `SELECT id FROM prescription WHERE DoctorID = ? AND prescriptionId = ?`,
      [DoctorID, prescriptionId]
    );

    if (!exist.length) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    await db.query(
      `UPDATE prescription SET 
        patientName = ?, age = ?, date = ?, address = ?, description = ?, 
        prescription = ?, nextVisit = ?
      WHERE DoctorID = ? AND prescriptionId = ?`,
      [
        patientName, age, date, address, description,
        JSON.stringify(prescription), nextVisit,
        DoctorID, prescriptionId
      ]
    );

    res.status(200).json({ message: "Prescription updated ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Update failed" });
  }
};

// ✅ Delete a prescription
const deletePrescription = async (req, res) => {
  const db = global.db;
  const { DoctorID, prescriptionId } = req.params;

  try {
    const [result] = await db.query(
      `DELETE FROM prescription WHERE DoctorID = ? AND prescriptionId = ?`,
      [DoctorID, prescriptionId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    res.status(200).json({ message: "Prescription deleted ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Delete failed" });
  }
};

module.exports = {
    createPrescription,
  getPrescriptionsByDoctor,
  getPrescription,
  updatePrescription,
  deletePrescription
};
