const db = global.db;

// ✅ Add or update stage data
exports.addStageData = async (req, res) => {
  try {
    const { userId, userName, stageNumber, marks, extraInfo } = req.body;

    if (!userId || !stageNumber || marks === undefined) {
      return res
        .status(400)
        .json({ error: "userId, stageNumber and marks are required" });
    }

    // Insert/Update quiz stage data
    await db.query(
      `INSERT INTO quiz_stage_user_data (userId, stageNumber, marks, extraInfo)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE marks = VALUES(marks), extraInfo = VALUES(extraInfo), createdAt = CURRENT_TIMESTAMP`,
      [userId, stageNumber, marks, JSON.stringify(extraInfo || {})]
    );

    // ✅ Fetch username from users table if not provided
    let fetchedName = userName;
    if (!fetchedName) {
      const [[user]] = await db.query(
        "SELECT name FROM users WHERE id = ?",
        [userId]
      );
      fetchedName = user?.name || null;
    }

    res.status(201).json({
      message: "Stage data saved/updated successfully",
      userId,
      userName: fetchedName,
      stageNumber,
      marks,
      extraInfo,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get all stage data (with userName)
exports.getAllStageData = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT q.id, q.userId, u.name AS userName, q.stageNumber, q.marks, q.extraInfo, q.createdAt
      FROM quiz_stage_user_data q
      JOIN users u ON q.userId = u.id
      ORDER BY q.userId, q.stageNumber
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get stage data by userId (with userName)
exports.getUserStageData = async (req, res) => {
  try {
    const { userId } = req.params;
    const [rows] = await db.query(
      `
      SELECT q.id, q.userId, u.name AS userName, q.stageNumber, q.marks, q.extraInfo, q.createdAt
      FROM quiz_stage_user_data q
      JOIN users u ON q.userId = u.id
      WHERE q.userId = ?
      ORDER BY q.stageNumber
    `,
      [userId]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update stage data for a user
exports.updateUserStageData = async (req, res) => {
  try {
    const { userId } = req.params;
    const { stageNumber, marks, extraInfo } = req.body;

    const [result] = await db.query(
      `UPDATE quiz_stage_user_data 
       SET marks = ?, extraInfo = ?
       WHERE userId = ? AND stageNumber = ?`,
      [marks, JSON.stringify(extraInfo || {}), userId, stageNumber]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Stage data not found for this user" });
    }

    res.json({ message: "User stage data updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete all stage data for a user
exports.deleteUserStageData = async (req, res) => {
  try {
    const { userId } = req.params;

    const [result] = await db.query(
      "DELETE FROM quiz_stage_user_data WHERE userId = ?",
      [userId]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "No stage data found for this user" });
    }

    res.json({ message: "All stage data for user deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get user quiz progress (with userName)
exports.getUserProgress = async (req, res) => {
  try {
    const { userId } = req.params;

    const [rows] = await db.query(
      `
      SELECT q.stageNumber, q.marks, q.extraInfo, u.name AS userName
      FROM quiz_stage_user_data q
      JOIN users u ON q.userId = u.id
      WHERE q.userId = ?
      ORDER BY q.stageNumber
    `,
      [userId]
    );

    const completedStages = rows.map((r) => r.stageNumber);
    const totalCompleted = completedStages.length;
    const totalStages = 6;
    const remainingStages = Array.from({ length: totalStages }, (_, i) => i + 1).filter(
      (stage) => !completedStages.includes(stage)
    );

    res.json({
      userId,
      userName: rows[0]?.userName || null,
      totalStages,
      totalCompleted,
      completedStages,
      remainingStages,
      details: rows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get final result after all 6 stages (with userName)
exports.getUserResult = async (req, res) => {
  try {
    const { userId } = req.params;
    const totalStages = 6;

    const [rows] = await db.query(
      `
      SELECT q.stageNumber, q.marks, q.extraInfo, u.name AS userName
      FROM quiz_stage_user_data q
      JOIN users u ON q.userId = u.id
      WHERE q.userId = ?
      ORDER BY q.stageNumber
    `,
      [userId]
    );

    const completedStages = rows.length;
    const totalMarks = rows.reduce((sum, r) => sum + (r.marks || 0), 0);
    const averageMarks = completedStages > 0 ? totalMarks / completedStages : 0;

    res.json({
      userId,
      userName: rows[0]?.userName || null,
      totalStages,
      completedStages,
      totalMarks,
      averageMarks,
      status: completedStages === totalStages ? "Completed" : "In Progress",
      details: rows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
