const db = global.db;

// Helper to parse JSON array safely
const parseJsonArray = (data) => {
  try {
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// Helper to format input into a JSON string
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

// 🟢 Get all blog topics
exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM blogtopics');
    res.json({ result: "Success", resultData: rows });
  } catch (err) {
    res.status(500).json({ result: "Failed", message: err.message });
  }
};

// 🟢 Get blog topic by ID
exports.getById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM blogtopics WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ result: "Failed", message: 'Not found' });
    res.json({ result: "Success", resultData: rows[0] });
  } catch (err) {
    res.status(500).json({ result: "Failed", message: err.message });
  }
};

// 🟢 Create blog topic
exports.create = async (req, res) => {
  try {
    const { topic, bannerUrl, description} = req.body;
    const [result] = await db.query(
      'INSERT INTO blogtopics (topic, bannerUrl, description) VALUES (?, ?, ?)',
      [topic, bannerUrl, description]
    );
    res.status(201).json({
      result: "Success",
      resultData: { message: 'Blog topic created', insertId: result.insertId }
    });
  } catch (err) {
    res.status(500).json({ result: "Failed", message: err.message });
  }
};

// 🟢 Update blog topic
exports.update = async (req, res) => {
  try {
    const { topic, bannerUrl, description } = req.body;
    const [result] = await db.query(
      'UPDATE blogtopics SET topic = ?, bannerUrl = ?, description = ? WHERE id = ?',
      [topic, bannerUrl, description, req.params.id]
    );
    res.json({
      result: "Success",
      resultData: { message: 'Blog topic updated', affectedRows: result.affectedRows }
    });
  } catch (err) {
    res.status(500).json({ result: "Failed", message: err.message });
  }
};

// 🟢 Delete blog topic
exports.remove = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM blogtopics WHERE id = ?', [req.params.id]);
    res.json({
      result: "Success",
      resultData: { message: 'Blog topic deleted', affectedRows: result.affectedRows }
    });
  } catch (err) {
    res.status(500).json({ result: "Failed", message: err.message });
  }
};

// 🟢 Get all blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM blogs');
    const resultData = rows.map(row => ({
      ...row
    }));
    res.json({ result: "Success", resultData });
  } catch (err) {
    res.status(500).json({ result: "Failed", message: err.message });
  }
};

// 🟢 Get blog by ID
exports.getBlogById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM blogs WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ result: "Failed", message: 'Not found' });

    const blog = rows[0];
    

    res.json({ result: "Success", resultData: blog });
  } catch (err) {
    res.status(500).json({ result: "Failed", message: err.message });
  }
};

// 🟢 Create blog
exports.createBlog = async (req, res) => {
  try {
    const {
      bannerImage, title, content, videoUrl, imageUrl,
      author, category, status, gallery, publishDate, blogtopicsID
    } = req.body;

    const finalGallery = formatArrayToJson(gallery);

    const [result] = await db.query(
      `INSERT INTO blogs 
        (bannerImage, title, content, videoUrl, imageUrl, author, category, status, gallery, publishDate, blogtopicsID)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        bannerImage, title, content, videoUrl, imageUrl,
        author, category, status, finalGallery, publishDate, blogtopicsID
      ]
    );

    res.status(201).json({
      result: "Success",
      resultData: { message: 'Blog created', insertId: result.insertId }
    });
  } catch (err) {
    res.status(500).json({ result: "Failed", message: err.message });
  }
};

// 🟢 Update blog
exports.updateBlog = async (req, res) => {
  try {
    const {
      bannerImage, title, content, videoUrl, imageUrl,
      author, category, status, gallery, publishDate, blogtopicsID
    } = req.body;

    const finalGallery = formatArrayToJson(gallery);

    const [result] = await db.query(
      `UPDATE blogs SET 
        bannerImage = ?, title = ?, content = ?, videoUrl = ?, imageUrl = ?, 
        author = ?, category = ?, status = ?, gallery = ?, publishDate = ?, blogtopicsID = ?
       WHERE id = ?`,
      [
        bannerImage, title, content, videoUrl, imageUrl,
        author, category, status, finalGallery, publishDate, blogtopicsID, req.params.id
      ]
    );

    res.json({
      result: "Success",
      resultData: { message: 'Blog updated', affectedRows: result.affectedRows }
    });
  } catch (err) {
    res.status(500).json({ result: "Failed", message: err.message });
  }
};

// 🟢 Delete blog
exports.removeBlog = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM blogs WHERE id = ?', [req.params.id]);
    res.json({
      result: "Success",
      resultData: { message: 'Blog deleted', affectedRows: result.affectedRows }
    });
  } catch (err) {
    res.status(500).json({ result: "Failed", message: err.message });
  }
};


exports.getBlogsByTopic = async (req, res) => {
  try {
    const topicId = req.params.topicId;
    const [rows] = await db.query('SELECT * FROM blogs WHERE blogtopicsID = ?', [topicId]);
    
    if (rows.length === 0) {
      return res.status(404).json({ result: "Failed", message: 'No blogs found for this topic' });
    }

    const resultData = rows.map(row => ({
      ...row,
      gallery: parseJsonArray(row.gallery)
    }));

    res.json({ result: "Success", resultData });
  } catch (err) {
    res.status(500).json({ result: "Failed", message: err.message });
  }
}