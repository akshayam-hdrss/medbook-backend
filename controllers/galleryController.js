global.db;

// Helper to parse imageUrl safely


// CREATE GALLERY
exports.createGallery = async (req, res) => {
  const { category, typeId, itemId, imageUrl } = req.body;

  try {
    let finalUrl;

    if (Array.isArray(imageUrl)) {
      // If imageUrl is an array
      finalUrl = JSON.stringify(imageUrl);
    } else if (typeof imageUrl === 'string') {
      try {
        // Try parsing it in case it's a stringified array
        const parsed = JSON.parse(imageUrl);
        finalUrl = Array.isArray(parsed)
          ? JSON.stringify(parsed)
          : JSON.stringify([imageUrl]);
      } catch (err) {
        // Not a JSON string, treat it as single image string
        finalUrl = JSON.stringify([imageUrl]);
      }
    } else {
      finalUrl = JSON.stringify([]);
    }

    const [result] = await db.query(
      `INSERT INTO gallery (category, typeId, itemId, imageUrl) VALUES (?, ?, ?, ?)`,
      [category, typeId, itemId, finalUrl]
    );

    res.status(200).json({
      message: 'Gallery created successfully',
      insertId: result.insertId,
    });
  } catch (err) {
    console.error('Error in createGallery:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// GET GALLERY
// GET GALLERY
exports.getGallery = async (req, res) => {
  const { category } = req.params;
  const { typeId, itemId } = req.query;

  try {
    let gallery = [];

    // 1️⃣ Exact match: category + typeId + itemId
    if (typeId && itemId) {
      [gallery] = await db.query(
        `SELECT * FROM gallery WHERE category = ? AND typeId = ? AND itemId = ?`,
        [category, typeId, itemId]
      );
    }

    // 2️⃣ category + typeId + itemId IS NULL
    if (!gallery.length && typeId) {
      [gallery] = await db.query(
        `SELECT * FROM gallery WHERE category = ? AND typeId = ? AND itemId IS NULL`,
        [category, typeId]
      );
    }

    // 3️⃣ category + typeId IS NULL + itemId IS NULL
    if (!gallery.length) {
      [gallery] = await db.query(
        `SELECT * FROM gallery WHERE category = ? AND typeId IS NULL AND itemId IS NULL`,
        [category]
      );
    }

    // 4️⃣ fallback to 'default'
    if (!gallery.length) {
      [gallery] = await db.query(
        `SELECT * FROM gallery WHERE category = 'default' AND typeId IS NULL AND itemId IS NULL`
      );
    }
   

    const resultData = gallery.map((row) => ({
      ...row,
      imageUrl: (() => {
        try {
          return row.imageUrl ? row.imageUrl :'[]';
        } catch (err) {
          return [];
        }
      })()
    }));

    res.json({ result: "Success", resultData });
  } catch (error) {
    console.error('Error in getGallery:', error);
    res.status(500).json({ result: "Failed", message: error.message });
  }
};


// UPDATE GALLERY
exports.updateGallery = async (req, res) => {
  const { id } = req.params;
  const { category, typeId, itemId, imageUrl } = req.body;

  try {
    let finalUrl;

    if (Array.isArray(imageUrl)) {
      finalUrl = JSON.stringify(imageUrl);
    } else if (typeof imageUrl === 'string') {
      try {
        const parsed = JSON.parse(imageUrl);
        finalUrl = Array.isArray(parsed)
          ? JSON.stringify(parsed)
          : JSON.stringify([imageUrl]);
      } catch (err) {
        finalUrl = JSON.stringify([imageUrl]);
      }
    } else {
      finalUrl = JSON.stringify([]);
    }

    await db.query(
      `UPDATE gallery SET category = ?, typeId = ?, itemId = ?, imageUrl = ? WHERE id = ?`,
      [category, typeId, itemId, finalUrl, id]
    );

    res.json({ result: "Success", message: "Gallery updated successfully" });
  } catch (error) {
    console.error('Error in updateGallery:', error);
    res.status(500).json({ result: "Failed", message: error.message });
  }
};



exports.deleteGallery = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query(`DELETE FROM gallery WHERE id = ?`, [id]);

    res.json({ result: "Success", resultData: "Gallery deleted" });
  } catch (error) {
    res.status(500).json({ result: "Failed", message: error.message });
  }
};


// GET DISTINCT GALLERY CATEGORIES
exports.getGalleryCategories = async (req, res) => {
  try {
    const [categories] = await db.query(
      `SELECT DISTINCT category FROM gallery WHERE category IS NOT NULL`
    );

    res.json({
      result: 'Success',
      resultData: categories.map((row) => row.category),
    });
  } catch (error) {
    console.error('Error in getGalleryCategories:', error);
    res.status(500).json({ result: 'Failed', message: error.message });
  }
};
