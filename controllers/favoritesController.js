const db = global.db;

// ➤ Add a favorite
exports.addFavorite = async (req, res) => {
  try {
    const { userId, doctorId, serviceId, productId } = req.body;

    const [result] = await db.query(
      `INSERT INTO favorites (userId, doctorId, serviceId, productId)
       VALUES (?, ?, ?, ?)`,
      [userId, doctorId, serviceId, productId]
    );

    res
      .status(201)
      .json({ message: "Favorite added successfully", id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ➤ Get all favorites for a user
exports.getFavoritesByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const [favorites] = await db.query(
      `SELECT * FROM favorites WHERE userId = ?`,
      [userId]
    );

    res.status(200).json(favorites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ➤ Update favorite
exports.updateFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const { doctorId, serviceId, productId } = req.body;

    await db.query(
      `UPDATE favorites
       SET doctorId = ?, serviceId = ?, productId = ?
       WHERE id = ?`,
      [doctorId, serviceId, productId, id]
    );

    res.status(200).json({ message: "Favorite updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ➤ Delete favorite
exports.deleteFavorite = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(`DELETE FROM favorites WHERE id = ?`, [id]);

    res.status(200).json({ message: "Favorite deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ➤ Get all favorites for a user with full details
exports.getFavoritesByUserdetails = async (req, res) => {
  try {
    const { userId } = req.params;

    const [favorites] = await db.query(
      `
      SELECT 
        f.id AS favoriteId,
        f.userId,

        -- Doctor Details
        d.id AS doctorId,
        d.doctorName,
        d.imageUrl AS doctorImage,
        d.businessName AS doctorBusinessName,
        d.designation,
        d.category,
        d.location AS doctorLocation,
        d.phone AS doctorPhone,
        d.whatsapp AS doctorWhatsapp,
        d.rating,
        d.experience AS doctorExperience,
        d.degree,
        d.addressLine1 AS doctorAddress1,
        d.addressLine2 AS doctorAddress2,
        d.mapLink AS doctorMapLink,
        d.about AS doctorAbout,
        d.youtubeLink AS doctorYoutube,
        d.gallery AS doctorGallery,
        d.bannerUrl AS doctorBanner,
        d.district AS doctorDistrict,
        d.pincode AS doctorPincode,
        d.order_no AS doctorOrder,

        -- Service Details
        s.id AS serviceId,
        s.serviceName,
        s.imageUrl AS serviceImage,
        s.businessName AS serviceBusinessName,
        s.location AS serviceLocation,
        s.phone AS servicePhone,
        s.whatsapp AS serviceWhatsapp,
        s.experience AS serviceExperience,
        s.addressLine1 AS serviceAddress1,
        s.addressLine2 AS serviceAddress2,
        s.mapLink AS serviceMapLink,
        s.about AS serviceAbout,
        s.youtubeLink AS serviceYoutube,
        s.gallery AS serviceGallery,
        s.bannerUrl AS serviceBanner,
        s.district AS serviceDistrict,
        s.pincode AS servicePincode,
        s.order_no AS serviceOrder,

        -- Product Details
        p.id AS productId,
        p.productName,
        p.price,
        p.imageUrl AS productImage,
        p.businessName AS productBusinessName,
        p.location AS productLocation,
        p.phone AS productPhone,
        p.whatsapp AS productWhatsapp,
        p.experience AS productExperience,
        p.addressLine1 AS productAddress1,
        p.addressLine2 AS productAddress2,
        p.mapLink AS productMapLink,
        p.about AS productAbout,
        p.youtubeLink AS productYoutube,
        p.gallery AS productGallery,
        p.bannerUrl AS productBanner,
        p.district AS productDistrict,
        p.pincode AS productPincode,
        p.order_no AS productOrder

      FROM favorites f
      LEFT JOIN doctor d ON f.doctorId = d.id
      LEFT JOIN service s ON f.serviceId = s.id
      LEFT JOIN product p ON f.productId = p.id
      WHERE f.userId = ?
      ORDER BY f.id DESC
      `,
      [userId]
    );

    res.status(200).json(favorites);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};
