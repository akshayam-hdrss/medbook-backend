// controllers/notificationController.js

exports.getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const [rows] = await global.db.query(
      `SELECT * FROM notifications WHERE userId=? ORDER BY createdAt DESC`,
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error('getNotifications error:', err);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

exports.markRead = async (req, res) => {
  try {
    const { id } = req.params;
    await global.db.query(`UPDATE notifications SET isRead=TRUE WHERE id=?`, [id]);
    res.json({ success: true });
  } catch (err) {
    console.error('markRead error:', err);
    res.status(500).json({ error: 'Failed to mark read' });
  }
};

exports.markAllRead = async (req, res) => {
  try {
    const { userId } = req.params;
    await global.db.query(`UPDATE notifications SET isRead=TRUE WHERE userId=?`, [userId]);
    res.json({ success: true });
  } catch (err) {
    console.error('markAllRead error:', err);
    res.status(500).json({ error: 'Failed to mark all read' });
  }
};
