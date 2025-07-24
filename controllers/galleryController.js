global.db;

// Helper to parse imageUrl safely


// CREATE GALLERY
exports.createGallery = async (req, res) => {
  const { category, typeId, itemId, imageUrl, youtubeLinks } = req.body;

  try {
    const formatArrayToJson = (data) => {
      if (Array.isArray(data)) {
        return JSON.stringify(data);
      } else if (typeof data === 'string') {
        try {
          const parsed = JSON.parse(data);
          return Array.isArray(parsed) ? JSON.stringify(parsed) : JSON.stringify([data]);
        } catch {
          return JSON.stringify([data]);
        }
      }
      return JSON.stringify([]);
    };

    const finalImageUrl = formatArrayToJson(imageUrl);
    const finalYoutubeLinks = formatArrayToJson(youtubeLinks);

    const [result] = await db.query(
      `INSERT INTO gallery (category, typeId, itemId, imageUrl, youtubeLinks) VALUES (?, ?, ?, ?, ?)`,
      [category, typeId, itemId, finalImageUrl, finalYoutubeLinks]
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
      })(),
      youtubeLinks: (() => {
        try {
          return row.youtubeLinks ? row.youtubeLinks : "[]";
        } catch {
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
  const { category, typeId, itemId, imageUrl, youtubeLinks } = req.body;

  try {
    const formatArrayToJson = (data) => {
      if (Array.isArray(data)) {
        return JSON.stringify(data);
      } else if (typeof data === 'string') {
        try {
          const parsed = JSON.parse(data);
          return Array.isArray(parsed) ? JSON.stringify(parsed) : JSON.stringify([data]);
        } catch {
          return JSON.stringify([data]);
        }
      }
      return JSON.stringify([]);
    };

    const finalImageUrl = formatArrayToJson(imageUrl);
    const finalYoutubeLinks = formatArrayToJson(youtubeLinks);

    await db.query(
      `UPDATE gallery SET category = ?, typeId = ?, itemId = ?, imageUrl = ?, youtubeLinks = ? WHERE id = ?`,
      [category, typeId, itemId, finalImageUrl, finalYoutubeLinks, id]
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
