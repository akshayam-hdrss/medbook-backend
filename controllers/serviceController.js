const db = global.db;

// Get all available services
exports.getAllAvailableServices = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name, imageUrl FROM availableService');
    res.json({ result: "Success", resultData: rows });
  } catch (error) {
    res.status(500).json({ result: "Failed", message: error.message });
  }
};

// Add a new available service
exports.addAvailableService = async (req, res) => {
  try {
    const { name, imageUrl } = req.body;
    const [result] = await db.query(
      'INSERT INTO availableService (name, imageUrl) VALUES (?, ?)',
      [name, imageUrl]
    );
    res.json({ result: "Success", message: "Service added", resultData: { id: result.insertId, name, imageUrl } });
  } catch (error) {
    res.status(500).json({ result: "Failed", message: error.message });
  }
};

// Update available service
exports.updateAvailableService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, imageUrl } = req.body;
    await db.query('UPDATE availableService SET name = ?, imageUrl = ? WHERE id = ?', [name, imageUrl, id]);
    res.json({ result: "Success", message: "Service updated" });
  } catch (error) {
    res.status(500).json({ result: "Failed", message: error.message });
  }
};

// Delete available service
exports.deleteAvailableService = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM availableService WHERE id = ?', [id]);
    res.json({ result: "Success", message: "Service deleted" });
  } catch (error) {
    res.status(500).json({ result: "Failed", message: error.message });
  }
};

// Get service types by availableServiceId
exports.getServiceTypesByAvailableServiceId = async (req, res) => {
  try {
    const { availableServiceId } = req.params;
    const [rows] = await db.query(
      'SELECT id, name, imageUrl FROM serviceType WHERE availableServiceId = ?',
      [availableServiceId]
    );
    res.json({ result: "Success", resultData: rows });
  } catch (error) {
    res.status(500).json({ result: "Failed", message: error.message });
  }
};

// Add service type
exports.addServiceType = async (req, res) => {
  try {
    const { name, imageUrl, availableServiceId } = req.body;
    const [result] = await db.query(
      'INSERT INTO serviceType (name, imageUrl, availableServiceId) VALUES (?, ?, ?)',
      [name, imageUrl, availableServiceId]
    );
    res.json({ result: "Success", message: "Service type added", resultData: { id: result.insertId, name, imageUrl } });
  } catch (error) {
    res.status(500).json({ result: "Failed", message: error.message });
  }
};

// Update service type
exports.updateServiceType = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, imageUrl, availableServiceId } = req.body;
    await db.query(
      'UPDATE serviceType SET name = ?, imageUrl = ?, availableServiceId = ? WHERE id = ?',
      [name, imageUrl, availableServiceId, id]
    );
    res.json({ result: "Success", message: "Service type updated" });
  } catch (error) {
    res.status(500).json({ result: "Failed", message: error.message });
  }
};

// Delete service type
exports.deleteServiceType = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM serviceType WHERE id = ?', [id]);
    res.json({ result: "Success", message: "Service type deleted" });
  } catch (error) {
    res.status(500).json({ result: "Failed", message: error.message });
  }
};

// ➕ Add a service
exports.addService = async (req, res) => {
  try {
    const {
      serviceName, imageUrl, businessName, location, phone, whatsapp, experience,
      addressLine1, addressLine2, mapLink, about, youtubeLink, gallery, bannerUrl, serviceTypeId
    } = req.body;

    const [result] = await db.query(`
      INSERT INTO service (
        serviceName, imageUrl, businessName, location, phone, whatsapp, experience,
        addressLine1, addressLine2, mapLink, about, youtubeLink, gallery, bannerUrl, serviceTypeId
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        serviceName, imageUrl, businessName, location, phone, whatsapp, experience,
        addressLine1, addressLine2, mapLink, about, youtubeLink,
        JSON.stringify(gallery || []), bannerUrl, serviceTypeId
      ]
    );

    res.json({ result: "Success", message: "Service added", serviceId: result.insertId });
  } catch (error) {
    res.status(500).json({ result: "Failed", message: error.message });
  }
};

// ✏️ Update service
exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      serviceName, imageUrl, businessName, location, phone, whatsapp, experience,
      addressLine1, addressLine2, mapLink, about, youtubeLink, gallery, bannerUrl, serviceTypeId
    } = req.body;

    await db.query(
      `UPDATE service SET
        serviceName=?, imageUrl=?, businessName=?, location=?, phone=?, whatsapp=?, experience=?,
        addressLine1=?, addressLine2=?, mapLink=?, about=?, youtubeLink=?, gallery=?, bannerUrl=?, serviceTypeId=?
       WHERE id=?`,
      [
        serviceName, imageUrl, businessName, location, phone, whatsapp, experience,
        addressLine1, addressLine2, mapLink, about, youtubeLink,
        JSON.stringify(gallery || []), bannerUrl, serviceTypeId, id
      ]
    );

    res.json({ result: "Success", message: "Service updated" });
  } catch (error) {
    res.status(500).json({ result: "Failed", message: error.message });
  }
};

// 📥 Get service by ID
exports.getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM service WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ result: "Failed", message: "Service not found" });
    }

    const row = rows[0];

    res.json({
      result: "Success",
      resultData: {
        ...row,
        gallery: (() => {
          try {
            return row.gallery ? JSON.parse(row.gallery) : [];
          } catch (err) {
            return [];
          }
        })(),
      },
    });
  } catch (error) {
    res.status(500).json({ result: "Failed", message: error.message });
  }
};


// 📋 Get all services by serviceTypeId
exports.getServicesByServiceTypeId = async (req, res) => {
  try {
    const { serviceTypeId } = req.params;
    const [rows] = await db.query('SELECT * FROM service WHERE serviceTypeId = ?', [serviceTypeId]);

    const parsedRows = rows.map((row) => ({
      ...row,
      gallery: (() => {
        try {
          return row.gallery ? JSON.parse(row.gallery) : [];
        } catch (err) {
          return [];
        }
      })(),
    }));

    res.json({ result: "Success", resultData: parsedRows });
  } catch (error) {
    res.status(500).json({ result: "Failed", message: error.message });
  }
};


// ❌ Delete service
exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM service WHERE id = ?', [id]);
    res.json({ result: "Success", message: "Service deleted" });
  } catch (error) {
    res.status(500).json({ result: "Failed", message: error.message });
  }
};


exports.getAllServices = async (req, res) => {
  try {
    const { serviceTypeId } = req.query;

    let query = `
      SELECT 
        s.id, s.serviceName, s.imageUrl, s.businessName, s.location, s.phone, s.whatsapp,
        s.experience, s.bannerUrl,
        IFNULL(AVG(r.rating), 0) AS rating
      FROM service s
      LEFT JOIN serviceReview r ON s.id = r.serviceId
      WHERE 1=1
    `;
    const params = [];

    if (serviceTypeId) {
      query += " AND s.serviceTypeId = ?";
      params.push(serviceTypeId);
    }

    query += " GROUP BY s.id";

    const [rows] = await db.query(query, params);

    const services = rows.map((row) => ({
      id: row.id,
      serviceName: row.serviceName || "",
      imageUrl: row.imageUrl || "",
      businessName: row.businessName || "",
      location: row.location || "",
      phone: row.phone || "",
      whatsapp: row.whatsapp || "",
      experience: row.experience || "",
      bannerUrl: row.bannerUrl || "",
    //   rating: row.rating ? parseFloat(row.rating).toFixed(1) : "0.0"
    rating: "0.0"
    }));

    res.json({ result: "Success", resultData: services });
  } catch (error) {
    res.status(500).json({ result: "Failed", message: error.message });
  }
};
