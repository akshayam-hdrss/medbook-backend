const db = global.db;

// 📌 Helper: parse JSON safely
const parseJsonArray = (data) => {
  try {
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

// ✅ CREATE
exports.createEvent = async (req, res) => {
  const { title, description, banner_image, youtubeLink, gallery } = req.body;
  try {
    await db.query(
      'INSERT INTO event (title, description, banner_image, youtubeLink, gallery) VALUES (?, ?, ?, ?, ?)',
      [title, description, banner_image, youtubeLink, JSON.stringify(gallery)]
    );
    res.json({ result: 'Success', message: 'Event created successfully' });
  } catch (err) {
    res.status(500).json({ result: 'Failed', message: err.message });
  }
};

// ✅ READ ALL
// Helper function to safely parse JSON

exports.getAllEvents = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM event');

    const resultData = rows.map(row => {
      
      return {
        ...row,
        gallery: row.gallery ? row.gallery : [],
      };
    });

    res.json({ result: 'Success', resultData });
  } catch (err) {
    console.error('Error fetching events:', err.message);
    res.status(500).json({ result: 'Failed', message: err.message });
  }
};


// ✅ READ ONE
exports.getEventById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM event WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ result: 'Failed', message: 'Event not found' });
    }
    const event = rows[0];
    event.gallery = event.gallery ? event.gallery : [];
    res.json({ result: 'Success', event });
  } catch (err) {
    res.status(500).json({ result: 'Failed', message: err.message });
  }
};

// ✅ UPDATE
exports.updateEvent = async (req, res) => {
  const { id } = req.params;
  const { title, description, banner_image, youtubeLink, gallery } = req.body;
  try {
    await db.query(
      'UPDATE event SET title = ?, description = ?, banner_image = ?, youtubeLink = ?, gallery = ? WHERE id = ?',
      [title, description, banner_image, youtubeLink, JSON.stringify(gallery), id]
    );
    res.json({ result: 'Success', message: 'Event updated successfully' });
  } catch (err) {
    res.status(500).json({ result: 'Failed', message: err.message });
  }
};

// ✅ DELETE
exports.deleteEvent = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM event WHERE id = ?', [id]);
    res.json({ result: 'Success', message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ result: 'Failed', message: err.message });
  }
};
