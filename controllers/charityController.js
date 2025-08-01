      const db = global.db;

// Create Charity
exports.createCharity = async (req, res) => {
  try {
    const { title, description, banner_image, youtubeLink, imageUrl, gallery } = req.body;

    await db.query(`
      INSERT INTO charities (title, description, banner_image, youtubeLink, imageUrl, gallery)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      title,
      description,
      banner_image,
      youtubeLink,
      imageUrl,
      JSON.stringify(gallery || [])
    ]);

    res.status(201).json({ message: 'Charity created successfully' });
  } catch (error) {
    console.error('Create Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Get All Charities
exports.getAllCharities = async (req, res) => {
  try {
    const [results] = await db.query(`SELECT * FROM charities`);

    const charities = results.map(c => ({
      ...c,
      gallery: c.gallery || []
    }));

    res.status(200).json({
      message: 'Success',
      resultData: charities
    });
  } catch (error) {
    console.error('Fetch Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Get One Charity
exports.getCharityById = async (req, res) => {
  try {
    const { id } = req.params;
    const [results] = await db.query(`SELECT * FROM charities WHERE id = ?`, [id]);

    if (results.length === 0) {
      return res.status(404).json({ error: 'Charity not found' });
    }

    const charity = results[0];
    charity.gallery = charity.gallery || [];

    res.status(200).json({
      message: 'Success',
      resultData: charity
    });
  } catch (error) {
    console.error('Error fetching charity by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Update Charity
exports.updateCharity = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, banner_image, youtubeLink, imageUrl, gallery } = req.body;

    await db.query(`
      UPDATE charities
      SET title = ?, description = ?, banner_image = ?, youtubeLink = ?, imageUrl = ?, gallery = ?
      WHERE id = ?
    `, [
      title,
      description,
      banner_image,
      youtubeLink,
      imageUrl,
      JSON.stringify(gallery || []),
      id
    ]);

    res.json({ message: 'Charity updated successfully' });
  } catch (error) {
    console.error('Update Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete Charity
exports.deleteCharity = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query(`DELETE FROM charities WHERE id = ?`, [id]);
    res.json({ message: 'Charity deleted successfully' });
  } catch (error) {
    console.error('Delete Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};