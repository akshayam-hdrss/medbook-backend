const db = global.db;

// ✅ Get all doctors (filtered fields with average rating)
// ✅ Get all doctors (full details with average rating)
exports.getAllDoctors = async (req, res) => {
  try {
    const { doctorTypeId, hospitalId, district, location } = req.query;

    let doctorQuery = `
      SELECT d.*, IFNULL(AVG(r.rating), 0) as rating
      FROM doctor d
      LEFT JOIN doctorReview r ON d.id = r.doctorId
      WHERE 1=1
    `;
    const doctorParams = [];

    if (doctorTypeId) {
      doctorQuery += " AND d.doctorTypeId = ?";
      doctorParams.push(doctorTypeId);
    }

    if (hospitalId) {
      doctorQuery += " AND d.hospitalId = ?";
      doctorParams.push(hospitalId);
    }

    if (district) {
      doctorQuery += " AND d.district = ?";
      doctorParams.push(district);
    }

    if (location) {
      doctorQuery += " AND d.location = ?";
      doctorParams.push(location);
    }

    doctorQuery += " GROUP BY d.id";

    const [doctorRows] = await db.query(doctorQuery, doctorParams);

    const doctors = doctorRows.map((d) => {
      let gallery = [];
      try {
        gallery = JSON.parse(d.gallery);
        if (!Array.isArray(gallery)) gallery = [gallery];
      } catch (e) {
        gallery = d.gallery ? [d.gallery] : [];
      }

      return {
        id: d.id,
        doctorName: d.doctorName,
        imageUrl: d.imageUrl || "",
        businessName: d.businessName || "",
        designation: d.designation || "",
        degree: d.degree || "",
        category: d.category || "",
        location: d.location || "",
        phone: d.phone || "",
        whatsapp: d.whatsapp || "",
        rating: parseFloat(d.rating).toFixed(1),
        experience: d.experience || "",
        addressLine1: d.addressLine1 || "",
        addressLine2: d.addressLine2 || "",
        mapLink: d.mapLink || "",
        about: d.about || "",
        youtubeLink: d.youtubeLink || "",
        bannerUrl: d.bannerUrl || "",
        gallery,
        doctorTypeId: d.doctorTypeId,
        hospitalId: d.hospitalId,
        district: d.district || "",
        pincode: d.pincode || "",
      };
    });

    let categories = [];
    if (hospitalId) {
      const [categoryRows] = await db.query(
        "SELECT id, text, number FROM category WHERE hospitalId = ?",
        [hospitalId]
      );

      categories = categoryRows.map((c) => ({
        id: c.id,
        text: c.text,
        number: c.number,
      }));
    }

    res.json({
      result: "Success",
      resultData: doctors,
      category: categories,
    });
  } catch (error) {
    console.error(error);
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
    doctor.designation = doctor.designation || "";
    doctor.category = doctor.category || "";
    doctor.degree = doctor.degree || "";
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
    doctor.youtubeLink = doctor.youtubeLink || "";
    doctor.district = doctor.district || "";
    doctor.pincode = doctor.pincode || "";
    


    const flattenDeep = (arr) => arr.flat(Infinity);

try {

  let galleryData = doctor.gallery;
  if (
    Array.isArray(galleryData) &&
    galleryData.length === 1 &&
    typeof galleryData[0] === 'string' &&
    galleryData[0].includes('https://')
  ) {
    galleryData = JSON.parse(galleryData[0]); 
  }

  // Now flatten
  doctor.gallery = Array.isArray(galleryData)
    ? flattenDeep(galleryData)
    : [galleryData];

  
} catch (e) {
  
  doctor.gallery = doctor.gallery ? [doctor.gallery] : [];
}




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
      designation,
      category,
      location,
      phone,
      whatsapp,
      rating,
      experience,
      degree,
      addressLine1,
      addressLine2,
      mapLink,
      about,
      youtubeLink,
      gallery,
      doctorTypeId,
      hospitalId,
      bannerUrl,
      district,
      pincode,
    } = req.body;

    const [result] = await db.query(
      `INSERT INTO doctor (
        doctorName, imageUrl, businessName, designation, category, location, phone, whatsapp,
        rating, experience, degree, addressLine1, addressLine2, mapLink, about,
        youtubeLink, gallery, doctorTypeId, hospitalId, bannerUrl, district, pincode
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        doctorName,
        imageUrl,
        businessName,
        designation,
        category,
        location,
        phone,
        whatsapp,
        rating,
        experience,
        degree,
        addressLine1,
        addressLine2,
        mapLink,
        about,
        youtubeLink,
        JSON.stringify(gallery || []),
        doctorTypeId,
        hospitalId,
        bannerUrl,
        district,
        pincode,
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
      designation,
      category,
      location,
      phone,
      whatsapp,
      rating,
      experience,
      degree,
      addressLine1,
      addressLine2,
      mapLink,
      about,
      gallery,
      youtubeLink,
      doctorTypeId,
      hospitalId,
      bannerUrl,
      district,
      pincode,
    } = req.body;

    await db.query(
      `UPDATE doctor SET doctorName=?, imageUrl=?, businessName=?, designation=?, category=?, location=?, phone=?, whatsapp=?,
        rating=?, experience=?, degree=?, addressLine1=?, addressLine2=?, mapLink=?, about=?,
        gallery=?, youtubeLink=?, doctorTypeId=?, hospitalId=?, bannerUrl=?, district=?, pincode=? WHERE id=?`,
      [
        doctorName,
        imageUrl,
        businessName,
        designation,
        category,
        location,
        phone,
        whatsapp,
        rating,
        experience,
        degree,
        addressLine1,
        addressLine2,
        mapLink,
        about,
        JSON.stringify(gallery || []),
        youtubeLink,
        doctorTypeId,
        hospitalId,
        bannerUrl,
        district,
        pincode,
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


exports.getTopDoctors = async (req, res) => {
  try {
    const [rows] = await db.query(`
      WITH rankedDoctors AS (
        SELECT 
          d.id,
          d.doctorName,
          d.imageUrl,
          d.businessName,
          d.location,
          d.phone,
          d.whatsapp,
          d.degree,
          COUNT(r.rating) AS ratingCount,
          IFNULL(AVG(r.rating), 0) AS avgRating,
          dt.id AS doctorTypeId,
          dt.name AS doctorTypeName,
          ROW_NUMBER() OVER (
            PARTITION BY d.doctorTypeId
            ORDER BY AVG(r.rating) DESC, COUNT(r.rating) DESC
          ) AS rn
        FROM doctor d
        LEFT JOIN doctorReview r ON d.id = r.doctorId
        LEFT JOIN doctorType dt ON d.doctorTypeId = dt.id
        GROUP BY d.id
      )
      SELECT * FROM rankedDoctors WHERE rn = 1
    `);

    const topDoctors = rows.map((row) => ({
      id: row.id,
      doctorName: row.doctorName,
      imageUrl: row.imageUrl || "",
      businessName: row.businessName || "",
      designation: row.designation || "",
      category: row.category || "",
      location: row.location || "",
      phone: row.phone || "",
      whatsapp: row.whatsapp || "",
      rating: parseFloat(row.avgRating).toFixed(1),
      ratingCount: row.ratingCount,
      doctorTypeId: row.doctorTypeId,
      doctorTypeName: row.doctorTypeName || "",
      degree: row.degree || "",
    }));

    res.json({
      result: "Success",
      resultData: topDoctors,
    });
  } catch (error) {
    console.error("Error in getTopDoctors:", error);
    res.status(500).json({ result: "Failed", message: error.message });
  }
};
