// controllers/membershipController.js
const db = global.db;

/**
 * Check if a column exists in the current database for a table.
 * Uses INFORMATION_SCHEMA so it's safe across environments.
 */
async function hasColumn(tableName, columnName) {
  const [rows] = await db.query(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [tableName, columnName]
  );
  return rows.length > 0;
}

/**
 * Generate membership code like: MB2509001-CBE1
 * - MB (static)
 * - 25 (year last two digits)
 * - 09 (month)
 * - 001 (sequence for that month)
 * - -CBE1 (franchiseBranch, sanitized)
 */
async function generateMembershipCode(franchiseBranch) {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, "0");

  // count records for the same year+month (createdAt expected in table)
  const [rows] = await db.query(
    `SELECT COUNT(*) AS count FROM membership WHERE DATE_FORMAT(createdAt, '%y%m') = ?`,
    [`${year}${month}`]
  );
  const count = (rows[0] && rows[0].count) ? rows[0].count + 1 : 1;
  const seq = String(count).padStart(3, "0");

  const branchSanitized = (franchiseBranch || "")
    .toString()
    .replace(/[^A-Za-z0-9]/g, "")
    .toUpperCase() || "BR";

  return `MB${year}${month}${seq}-${branchSanitized}`;
}

/**
 * Helper to compute validTo date (YYYY-MM-DD) from validFrom and validityDays
 */
function computeValidTo(validFrom, validityDays) {
  if (!validFrom || !validityDays) return null;
  const d = new Date(validFrom);
  if (Number.isNaN(d.getTime())) return null;
  d.setDate(d.getDate() + parseInt(validityDays, 10));
  return d.toISOString().slice(0, 10);
}

/**
 * CREATE
 */
exports.addMembership = async (req, res) => {
  try {
    const {
      addInName,
      contactPerson,
      mobile,
      additionalNo,
      franchiseBranch,
      email,
      website,
      address1,
      address2,
      district,
      pincode,
      additionalBranch,
      additionalDoctor,
      banner,
      premiumBanner,
      video,
      premiumVideo,
      paymentMode,
      transactionId,
      validFrom,
      validityDays,
      executiveId,
      executiveName,
      executiveMobile,
      category,
      subCategory,
      subSubCategory,
      package: pkg
    } = req.body;

    if (!addInName || !contactPerson || !mobile || !franchiseBranch || !pkg || !transactionId) {
      return res.status(400).json({
        result: false,
        message: "Required fields: addInName, contactPerson, mobile, franchiseBranch, package, transactionId",
        resultData: null
      });
    }

    // ✅ Always generate membershipCode
    const generatedCode = await generateMembershipCode(franchiseBranch);

    // compute validTo
    const validTo = computeValidTo(validFrom, validityDays);

    const columns = [];
    const placeholders = [];
    const values = [];

    // ✅ Always insert membershipCode
    columns.push("membershipCode");
    placeholders.push("?");
    values.push(generatedCode);

    // helper
    const addField = (col, val) => {
      columns.push(col);
      placeholders.push("?");
      values.push(val);
    };

    addField("addInName", addInName);
    addField("contactPerson", contactPerson);
    addField("mobile", mobile);
    addField("additionalNo", additionalNo || null);
    addField("franchiseBranch", franchiseBranch);
    addField("email", email || null);
    addField("website", website || null);
    addField("address1", address1 || null);
    addField("address2", address2 || null);
    addField("district", district || null);
    addField("pincode", pincode || null);
    addField("additionalBranch", additionalBranch || 0);
    addField("additionalDoctor", additionalDoctor || 0);
    addField("banner", banner || 0);
    addField("premiumBanner", premiumBanner || 0);
    addField("video", video || 0);
    addField("premiumVideo", premiumVideo || 0);
    addField("paymentMode", paymentMode || null);
    addField("transactionId", transactionId);
    addField("validFrom", validFrom || null);
    addField("validityDays", validityDays || 0);
    addField("executiveId", executiveId || null);
    addField("executiveName", executiveName || null);
    addField("executiveMobile", executiveMobile || null);
    addField("category", category || null);
    addField("subCategory", subCategory || null);
    addField("subSubCategory", subSubCategory || null);
    addField("package", pkg);

    if (validTo) {
      addField("validTo", validTo);
    }

    const sql = `INSERT INTO membership (${columns.join(",")}) VALUES (${placeholders.join(",")})`;
    const [result] = await db.query(sql, values);

    if (!result || result.affectedRows === 0) {
      return res.status(500).json({
        result: false,
        message: "Failed to create membership",
        resultData: null
      });
    }

    return res.status(201).json({
      result: true,
      message: "✅ Membership created successfully",
      resultData: {
        id: result.insertId,
        membershipCode: generatedCode,
        addInName,
        contactPerson,
        mobile,
        franchiseBranch,
        package: pkg,
        validFrom,
        validTo
      }
    });
  } catch (err) {
    console.error("❌ addMembership error:", err);
    return res.status(500).json({
      result: false,
      message: err.message || "Internal server error",
      resultData: null
    });
  }
};

/**
 * READ ALL
 */
exports.getAllMemberships = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM membership ORDER BY createdAt DESC");
    return res.status(200).json({
      result: true,
      message: "✅ Memberships fetched successfully",
      resultData: rows
    });
  } catch (err) {
    console.error("❌ getAllMemberships error:", err);
    return res.status(500).json({
      result: false,
      message: err.message || "Internal server error",
      resultData: null
    });
  }
};

/**
 * READ BY ID
 */
exports.getMembershipById = async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await db.query("SELECT * FROM membership WHERE id = ?", [id]);
    if (!rows || rows.length === 0) {
      return res.status(404).json({
        result: false,
        message: "Membership not found",
        resultData: null
      });
    }
    return res.status(200).json({
      result: true,
      message: "✅ Membership fetched successfully",
      resultData: rows[0]
    });
  } catch (err) {
    console.error("❌ getMembershipById error:", err);
    return res.status(500).json({
      result: false,
      message: err.message || "Internal server error",
      resultData: null
    });
  }
};

/**
 * UPDATE
 */
exports.updateMembership = async (req, res) => {
  try {
    const id = req.params.id;
    const payload = req.body || {};

    // Allowed updatable columns
    const allowed = [
      "addInName", "contactPerson", "mobile", "additionalNo", "franchiseBranch", "email", "website",
      "address1", "address2", "district", "pincode", "additionalBranch", "additionalDoctor", "banner", "premiumBanner",
      "video", "premiumVideo", "paymentMode", "transactionId", "validFrom", "validityDays",
      "executiveId", "executiveName", "executiveMobile", "category", "subCategory", "subSubCategory", "package"
    ];

    const setParts = [];
    const values = [];

    // If package passed in body, map it (payload.package)
    for (const col of allowed) {
      // special handling for 'package' name in JS: it's a valid property name in payload
      if (Object.prototype.hasOwnProperty.call(payload, col)) {
        setParts.push(`${col} = ?`);
        values.push(payload[col]);
      }
    }

    // if validFrom/validityDays are present (or both), recompute validTo
    let computedValidTo = null;
    if (Object.prototype.hasOwnProperty.call(payload, "validFrom") || Object.prototype.hasOwnProperty.call(payload, "validityDays")) {
      const validFrom = payload.validFrom !== undefined ? payload.validFrom : null;
      const validityDays = payload.validityDays !== undefined ? payload.validityDays : null;

      // Use current DB values as fallback if one of them is missing
      if (!validFrom || !validityDays) {
        // fetch current row to combine values
        const [rows] = await db.query("SELECT validFrom, validityDays FROM membership WHERE id = ?", [id]);
        if (!rows || rows.length === 0) {
          return res.status(404).json({
            result: false,
            message: "Membership not found",
            resultData: null
          });
        }
        const current = rows[0];
        const from = validFrom || current.validFrom;
        const days = validityDays !== null && validityDays !== undefined ? validityDays : current.validityDays;
        computedValidTo = computeValidTo(from, days);
      } else {
        computedValidTo = computeValidTo(validFrom, validityDays);
      }

      // ensure we include validTo in update
      setParts.push("validTo = ?");
      values.push(computedValidTo);
    }

    if (setParts.length === 0) {
      return res.status(400).json({
        result: false,
        message: "No valid fields provided to update",
        resultData: null
      });
    }

    const sql = `UPDATE membership SET ${setParts.join(", ")} WHERE id = ?`;
    values.push(id);

    const [result] = await db.query(sql, values);

    if (!result || result.affectedRows === 0) {
      return res.status(404).json({
        result: false,
        message: "Membership not found or nothing updated",
        resultData: null
      });
    }

    // Return the updated row
    const [rowsAfter] = await db.query("SELECT * FROM membership WHERE id = ?", [id]);
    return res.status(200).json({
      result: true,
      message: "✅ Membership updated successfully",
      resultData: rowsAfter[0] || null
    });
  } catch (err) {
    console.error("❌ updateMembership error:", err);
    return res.status(500).json({
      result: false,
      message: err.message || "Internal server error",
      resultData: null
    });
  }
};

/**
 * DELETE
 */
exports.deleteMembership = async (req, res) => {
  try {
    const id = req.params.id;
    const [result] = await db.query("DELETE FROM membership WHERE id = ?", [id]);
    if (!result || result.affectedRows === 0) {
      return res.status(404).json({
        result: false,
        message: "Membership not found",
        resultData: null
      });
    }
    return res.status(200).json({
      result: true,
      message: "🗑️ Membership deleted successfully",
      resultData: { id }
    });
  } catch (err) {
    console.error("❌ deleteMembership error:", err);
    return res.status(500).json({
      result: false,
      message: err.message || "Internal server error",
      resultData: null
    });
  }
};
