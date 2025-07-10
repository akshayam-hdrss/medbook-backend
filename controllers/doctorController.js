const db = global.db;

// ✅ Get all doctors (filtered fields with average rating)
exports.getAllDoctors = async (req, res) => {
  try {
    const { doctorTypeId, hospitalId } = req.query;
    let query = `
      SELECT d.id, d.doctorName, d.imageUrl, d.businessName, d.location, d.phone, d.whatsapp,
             IFNULL(AVG(r.rating), 0) as rating
      FROM doctor d
      LEFT JOIN doctorReview r ON d.id = r.doctorId
      WHERE 1=1
    `;
    const params = [];

    if (doctorTypeId) {
      query += " AND d.doctorTypeId = ?";
      params.push(doctorTypeId);
    }
    if (hospitalId) {
      query += " AND d.hospitalId = ?";
      params.push(hospitalId);
    }

    query += " GROUP BY d.id";

    const [rows] = await db.query(query, params);
    const doctors = rows.map((row) => ({
      id: row.id,
      doctorName: row.doctorName,
      imageUrl: row.imageUrl || "",
      businessName: row.businessName || "",
      location: row.location || "",
      phone: row.phone || "",
      whatsapp: row.whatsapp || "",
      // rating: parseFloat(row.rating.toFixed(1))
      rating: row.rating ? parseFloat(row.rating).toFixed(1) : "0.0",
    }));

    res.json({ result: "Success", resultData: doctors });
  } catch (error) {
    res.status(500).json({ result: "Failed", message: error.message });
  }
};

// Get full doctor details
// ✅ Get full doctor details with average rating
exports.getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch doctor details
    const [rows] = await db.query("SELECT * FROM doctor WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ result: "Failed", message: "Doctor not found" });
    }

    const doctor = rows[0];

    // Fetch average rating
    const [ratingRows] = await db.query(
      "SELECT IFNULL(AVG(rating), 0) as avgRating FROM doctorReview WHERE doctorId = ?",
      [id]
    );
    const avgRatingRaw = ratingRows[0].avgRating;
    const avgRating = avgRatingRaw
      ? Math.round(parseFloat(avgRatingRaw) * 10) / 10
      : 0;

    doctor.imageUrl = doctor.imageUrl || "";
    doctor.businessName = doctor.businessName || "";
    doctor.location = doctor.location || "";
    doctor.phone = doctor.phone || "";
    doctor.whatsapp = doctor.whatsapp || "";
    doctor.rating = avgRating || 0;
    doctor.experience = doctor.experience || "";
    doctor.addressLine1 = doctor.addressLine1 || "";
    doctor.addressLine2 = doctor.addressLine2 || "";
    doctor.mapLink = doctor.mapLink || "";
    doctor.about = doctor.about || "";
    doctor.bannerUrl = doctor.bannerUrl || "";
    try {
      doctor.gallery = JSON.parse(doctor.gallery);
      if (!Array.isArray(doctor.gallery)) {
        doctor.gallery = [doctor.gallery]; // if a single string, wrap it in an array
      }
    } catch (e) {
      doctor.gallery = doctor.gallery ? [doctor.gallery] : [];
    }
    doctor.youtubeLink = doctor.youtubeLink || "";

    res.json({ result: "Success", resultData: doctor });
  } catch (error) {
    res.status(500).json({ result: "Failed", message: error.message });
  }
};

// Add a new doctor
exports.addDoctor = async (req, res) => {
  try {
    const {
      doctorName,
      imageUrl,
      businessName,
      location,
      phone,
      whatsapp,
      rating,
      experience,
      addressLine1,
      addressLine2,
      mapLink,
      about,
      youtubeLink,
      gallery,
      doctorTypeId,
      hospitalId,
      bannerUrl,
    } = req.body;

    const [result] = await db.query(
      `INSERT INTO doctor (
        doctorName, imageUrl, businessName, location, phone, whatsapp,
        rating, experience, addressLine1, addressLine2, mapLink, about,
        youtubeLink, gallery, doctorTypeId, hospitalId, bannerUrl
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        doctorName,
        imageUrl,
        businessName,
        location,
        phone,
        whatsapp,
        rating,
        experience,
        addressLine1,
        addressLine2,
        mapLink,
        about,
        youtubeLink,
        JSON.stringify(gallery || []),
        doctorTypeId,
        hospitalId,
        bannerUrl,
      ]
    );

    res.json({
      result: "Success",
      message: "Doctor added",
      resultData: { id: result.insertId },
    });
  } catch (error) {
    res.status(500).json({ result: "Failed", message: error.message });
  }
};

// Update doctor
exports.updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      doctorName,
      imageUrl,
      businessName,
      location,
      phone,
      whatsapp,
      rating,
      experience,
      addressLine1,
      addressLine2,
      mapLink,
      about,
      gallery,
      youtubeLink,
      doctorTypeId,
      hospitalId,
      bannerUrl,
    } = req.body;

    await db.query(
      `UPDATE doctor SET doctorName=?, imageUrl=?, businessName=?, location=?, phone=?, whatsapp=?,
        rating=?, experience=?, addressLine1=?, addressLine2=?, mapLink=?, about=?,
        gallery=?, youtubeLink=?, doctorTypeId=?, hospitalId=?, bannerUrl=? WHERE id=?`,
      [
        doctorName,
        imageUrl,
        businessName,
        location,
        phone,
        whatsapp,
        rating,
        experience,
        addressLine1,
        addressLine2,
        mapLink,
        about,
        JSON.stringify(gallery || []),
        youtubeLink,
        doctorTypeId,
        hospitalId,
        bannerUrl,
        id,
      ]
    );

    res.json({ result: "Success", message: "Doctor updated" });
  } catch (error) {
    res.status(500).json({ result: "Failed", message: error.message });
  }
};

// Delete doctor
exports.deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM doctor WHERE id = ?", [id]);
    res.json({ result: "Success", message: "Doctor deleted" });
  } catch (error) {
    res.status(500).json({ result: "Failed", message: error.message });
  }
};

// Add review
exports.addReview = async (req, res) => {
  try {
    const { id: doctorId } = req.params;
    const { comment, rating } = req.body;

    const [result] = await db.query(
      "INSERT INTO doctorReview (doctorId, comment, rating) VALUES (?, ?, ?)",
      [doctorId, comment, rating]
    );

    res.json({
      result: "Success",
      message: "Review added",
      resultData: { id: result.insertId },
    });
  } catch (error) {
    res.status(500).json({ result: "Failed", message: error.message });
  }
};

// Get reviews for a doctor
exports.getReviews = async (req, res) => {
  try {
    const { id: doctorId } = req.params;
    const [rows] = await db.query(
      "SELECT comment, rating FROM doctorReview WHERE doctorId = ?",
      [doctorId]
    );
    res.json({ result: "Success", resultData: rows });
  } catch (error) {
    res.status(500).json({ result: "Failed", message: error.message });
  }
};
