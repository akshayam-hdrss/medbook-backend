const db = global.db;

// ✅ CREATE (POST) - Add new question(s)
exports.createQuizQuestion = async (req, res) => {
  try {
    const data = req.body;

    // If single object → wrap inside array
    const questions = Array.isArray(data) ? data : [data];

    // Validate all fields
    for (const q of questions) {
      if (!q.question || !q.options || !q.answer || !q.stage) {
        return res.status(400).json({
          success: false,
          message: "Each question must include question, options, answer, stage"
        });
      }
    }

    // Prepare values for bulk insert
    const values = questions.map(q => [
      q.question,
      JSON.stringify(q.options),
      q.answer,
      q.stage
    ]);

    const [result] = await db.query(
      "INSERT INTO QuizQuestions (question, options, answer, stage) VALUES ?",
      [values]
    );

    res.json({
      success: true,
      message: `${questions.length} question(s) added successfully`,
      insertedId: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ READ (GET) - Get all questions OR by stage
exports.getQuizQuestions = async (req, res) => {
  try {
    const { stage } = req.query; // e.g. /api/quiz?stage=1
    let sql = "SELECT * FROM QuizQuestions";
    let params = [];

    if (stage) {
      sql += " WHERE stage = ?";
      params.push(stage);
    }

    const [rows] = await db.query(sql, params);

    res.json({ success: true, questions: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ READ SINGLE (GET by id)
exports.getQuizQuestionById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query("SELECT * FROM QuizQuestions WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Question not found" });
    }

    res.json({ success: true, question: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ UPDATE (PUT) - Update question
exports.updateQuizQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, options, answer, stage } = req.body;

    const [result] = await db.query(
      "UPDATE QuizQuestions SET question = ?, options = ?, answer = ?, stage = ? WHERE id = ?",
      [question, JSON.stringify(options), answer, stage, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Question not found" });
    }

    res.json({ success: true, message: "Question updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ DELETE - Remove question
exports.deleteQuizQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query("DELETE FROM QuizQuestions WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Question not found" });
    }

    res.json({ success: true, message: "Question deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};