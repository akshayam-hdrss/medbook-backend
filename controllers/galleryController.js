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


// Helper functions (add these at the top of your file)
const parseGalleryContent = (content) => {
  if (!content) return [];
  try {
    // Handle case where it's already an array
    if (Array.isArray(content)) return content;
    
    // Handle case where it's a stringified array
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    // Handle case where it's a single URL string
    if (typeof content === 'string' && content.startsWith('http')) {
      return [content];
    }
    return [];
  }
};

const checkIfRecordsExist = async (category, typeId = null, itemId = null) => {
  try {
    let query = `SELECT COUNT(*) as count FROM gallery WHERE category = ?`;
    const params = [category];
    
    if (typeId !== null) {
      query += ` AND typeId = ?`;
      params.push(typeId);
    } else {
      query += ` AND typeId IS NULL`;
    }
    
    if (itemId !== null) {
      query += ` AND itemId = ?`;
      params.push(itemId);
    } else {
      query += ` AND itemId IS NULL`;
    }
    
    const [result] = await db.query(query, params);
    return result[0].count > 0;
  } catch (err) {
    console.error('Error checking records:', err);
    return false;
  }
};

// Updated getGallery function
exports.getGallery = async (req, res) => {
  const { category } = req.params;
  const { typeId, itemId } = req.query;

  try {
    // Helper function to parse content safely
    const parseContent = (content) => {
      if (!content) return [];
      try {
        // Handle case where it's already an array
        if (Array.isArray(content)) return content;
        
        // Handle stringified JSON
        const parsed = JSON.parse(content);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        // Handle single URL strings
        if (typeof content === 'string' && content.startsWith('http')) {
          return [content];
        }
        return [];
      }
    };

    // 1️⃣ First try exact match (category + typeId + itemId)
    let queryParams = [category];
    let query = `SELECT * FROM gallery WHERE category = ?`;
    
    if (typeId !== undefined) {
      query += ` AND typeId = ?`;
      queryParams.push(typeId);
    } else {
      query += ` AND typeId IS NULL`;
    }

    if (itemId !== undefined) {
      query += ` AND itemId = ?`;
      queryParams.push(itemId);
    } else {
      query += ` AND itemId IS NULL`;
    }

    let [gallery] = await db.query(query, queryParams);

    // Process results
    const processResults = (rows) => {
      return rows.map(row => ({
        id: row.id,
        category: row.category,
        typeId: row.typeId,
        itemId: row.itemId,
        imageUrl: parseContent(row.imageUrl),
        youtubeLinks: parseContent(row.youtubeLinks)
      })).filter(item => 
        item.imageUrl.length > 0 || item.youtubeLinks.length > 0
      );
    };

    let resultData = processResults(gallery);

    // 2️⃣ If no exact match found, try category + typeId (itemId NULL)
    if (resultData.length === 0 && typeId !== undefined) {
      [gallery] = await db.query(
        `SELECT * FROM gallery 
         WHERE category = ? AND typeId = ? AND itemId IS NULL`,
        [category, typeId]
      );
      resultData = processResults(gallery);
    }

    // 3️⃣ If still no match, try category only (typeId NULL, itemId NULL)
    if (resultData.length === 0) {
      [gallery] = await db.query(
        `SELECT * FROM gallery 
         WHERE category = ? AND typeId IS NULL AND itemId IS NULL`,
        [category]
      );
      resultData = processResults(gallery);
    }

    // 4️⃣ Final fallback to default category
    if (resultData.length === 0 && category !== 'default') {
      [gallery] = await db.query(
        `SELECT * FROM gallery 
         WHERE category = 'default' AND typeId IS NULL AND itemId IS NULL`
      );
      resultData = processResults(gallery);
    }

    if (resultData.length > 0) {
      return res.json({ 
        result: "Success", 
        resultData,
        message: "Gallery content found"
      });
    }

    // No content found
    res.json({
      result: "Success",
      resultData: [],
      message: "No gallery content available",
      debugInfo: {
        requested: { category, typeId, itemId },
        searched: [
          "Exact match (category + typeId + itemId)",
          "Category + typeId (itemId NULL)",
          "Category only (typeId NULL, itemId NULL)",
          "Default category fallback"
        ]
      }
    });

  } catch (error) {
    console.error('Error in getGallery:', error);
    res.status(500).json({ 
      result: "Failed", 
      message: "Server error while fetching gallery"
    });
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


exports.getCorrectGallery = async (req, res) => {
  const { category } = req.params;
  let { typeId, itemId } = req.query;

  try {
    // Handle undefined, null, or empty string as actual NULL
    typeId = typeId === undefined || typeId === '' || typeId === 'null' ? null : typeId;
    itemId = itemId === undefined || itemId === '' || itemId === 'null' ? null : itemId;

    const [gallery] = await db.query(
      `SELECT * FROM gallery 
       WHERE category = ? 
       AND ${typeId === null ? 'typeId IS NULL' : 'typeId = ?'} 
       AND ${itemId === null ? 'itemId IS NULL' : 'itemId = ?'}`,
      [
        category,
        ...(typeId === null ? [] : [typeId]),
        ...(itemId === null ? [] : [itemId])
      ]
    );

    if (!gallery.length) {
      return res.json({
        result: "Success",
        message: "No table found",
        resultData: []
      });
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

    res.json({
      result: "Success",
      message: "Table found",
      resultData
    });

  } catch (error) {
    console.error("Error in getCorrectGallery:", error);
    res.status(500).json({ result: "Failed", message: error.message });
  }
};
