const db = global.db;

// ✅ Add a new employee
exports.createEmployee = async (req, res) => {
  try {
    const {
      employeeNumber,
      userName,
      employeeName,
      fatherName,
      doorStreet,
      villageArea,
      district,
      pincode,
      mobileNumber,
      gender,
      age,
      dateOfBirth,
      education,
      designation,
      aadharNo,
      voterId,
      bloodGroup,
      salary,
      employeeRole,
      employeeAccess
    } = req.body;

    // Validation
    if (!employeeNumber || !employeeName || !mobileNumber) {
      return res.status(400).json({
        resultdata: null,
        result: "error",
        message: "Employee number, name, and mobile number are required"
      });
    }

    const [result] = await db.query(
      `INSERT INTO employees (
        employeeNumber, userName, employeeName, fatherName, 
        doorStreet, villageArea, district, pincode, mobileNumber,
        gender, age, dateOfBirth, education, designation, aadharNo, voterId,
        bloodGroup, salary, employeeRole, employeeAccess
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        employeeNumber,
        userName,
        employeeName,
        fatherName,
        doorStreet,
        villageArea,
        district,
        pincode,
        mobileNumber,
        gender,
        age,
        dateOfBirth,
        education,
        designation,
        aadharNo,
        voterId,
        bloodGroup,
        salary,
        employeeRole,
        JSON.stringify(employeeAccess || {})
      ]
    );

    res.status(201).json({
      resultdata: { employeeId: result.insertId, employeeNumber },
      result: "success",
      message: "✅ Employee created successfully"
    });
  } catch (err) {
    console.error("❌ Error creating employee:", err);
    
    // Handle duplicate entry error
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        resultdata: null,
        result: "error",
        message: "Employee number already exists"
      });
    }

    res.status(500).json({
      resultdata: null,
      result: "error",
      message: "Server error while creating employee"
    });
  }
};

// ✅ Get all active employees
exports.getAllEmployees = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM employees WHERE isTerminated = false ORDER BY employeeName"
    );

    const employees = rows.map(emp => ({
      ...emp,
      employeeAccess: typeof emp.employeeAccess === 'string' 
        ? JSON.parse(emp.employeeAccess) 
        : emp.employeeAccess || {}
    }));

    res.json({
      resultdata: employees,
      result: "success",
      message: employees.length > 0 
        ? `✅ Found ${employees.length} active employees` 
        : "No active employees found"
    });
  } catch (err) {
    console.error("❌ Error fetching employees:", err);
    res.status(500).json({
      resultdata: null,
      result: "error",
      message: "Server error while fetching employees"
    });
  }
};

// ✅ Get terminated employees
exports.getTerminatedEmployees = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM employees WHERE isTerminated = true ORDER BY employeeName"
    );

    const employees = rows.map(emp => ({
      ...emp,
      employeeAccess: typeof emp.employeeAccess === 'string' 
        ? JSON.parse(emp.employeeAccess) 
        : emp.employeeAccess || {}
    }));

    res.json({
      resultdata: employees,
      result: "success",
      message: employees.length > 0 
        ? `✅ Found ${employees.length} terminated employees` 
        : "No terminated employees found"
    });
  } catch (err) {
    console.error("❌ Error fetching terminated employees:", err);
    res.status(500).json({
      resultdata: null,
      result: "error",
      message: "Server error while fetching terminated employees"
    });
  }
};

// ✅ Get employee by employeeNumber
exports.getEmployeeByNumber = async (req, res) => {
  try {
    const { employeeNumber } = req.params;
    
    if (!employeeNumber) {
      return res.status(400).json({
        resultdata: null,
        result: "error",
        message: "Employee number is required"
      });
    }

    const [rows] = await db.query(
      "SELECT * FROM employees WHERE employeeNumber = ?",
      [employeeNumber]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        resultdata: null,
        result: "error",
        message: "Employee not found"
      });
    }

    const employee = {
      ...rows[0],
      employeeAccess: typeof rows[0].employeeAccess === 'string' 
        ? JSON.parse(rows[0].employeeAccess) 
        : rows[0].employeeAccess || {}
    };

    res.json({
      resultdata: employee,
      result: "success",
      message: "✅ Employee details retrieved successfully"
    });
  } catch (err) {
    console.error("❌ Error fetching employee:", err);
    res.status(500).json({
      resultdata: null,
      result: "error",
      message: "Server error while fetching employee details"
    });
  }
};

// ✅ Update employee
exports.updateEmployee = async (req, res) => {
  try {
    const { employeeNumber } = req.params;
    const {
      userName,
      employeeName,
      fatherName,
      doorStreet,
      villageArea,
      district,
      pincode,
      mobileNumber,
      gender,
      age,
      dateOfBirth,
      education,
      designation,
      aadharNo,
      voterId,
      bloodGroup,
      salary,
      employeeRole,
      employeeAccess
    } = req.body;

    if (!employeeNumber) {
      return res.status(400).json({
        resultdata: null,
        result: "error",
        message: "Employee number is required"
      });
    }

    const [result] = await db.query(
      `UPDATE employees 
       SET userName=?, employeeName=?, fatherName=?, doorStreet=?, villageArea=?, district=?, 
           pincode=?, mobileNumber=?, gender=?, age=?, dateOfBirth=?, education=?, designation=?, 
           aadharNo=?, voterId=?, bloodGroup=?, salary=?, employeeRole=?, employeeAccess=? 
       WHERE employeeNumber=?`,
      [
        userName,
        employeeName,
        fatherName,
        doorStreet,
        villageArea,
        district,
        pincode,
        mobileNumber,
        gender,
        age,
        dateOfBirth,
        education,
        designation,
        aadharNo,
        voterId,
        bloodGroup,
        salary,
        employeeRole,
        JSON.stringify(employeeAccess || {}),
        employeeNumber
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        resultdata: null,
        result: "error",
        message: "Employee not found"
      });
    }

    res.json({
      resultdata: { employeeNumber },
      result: "success",
      message: "✅ Employee updated successfully"
    });
  } catch (err) {
    console.error("❌ Error updating employee:", err);
    res.status(500).json({
      resultdata: null,
      result: "error",
      message: "Server error while updating employee"
    });
  }
};

// ✅ Terminate employee
exports.terminateEmployee = async (req, res) => {
  try {
    const { employeeNumber } = req.params;
    
    if (!employeeNumber) {
      return res.status(400).json({
        resultdata: null,
        result: "error",
        message: "Employee number is required"
      });
    }

    const [result] = await db.query(
      "UPDATE employees SET isTerminated = true WHERE employeeNumber = ?",
      [employeeNumber]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        resultdata: null,
        result: "error",
        message: "Employee not found"
      });
    }

    res.json({
      resultdata: { employeeNumber },
      result: "success",
      message: "✅ Employee terminated successfully"
    });
  } catch (err) {
    console.error("❌ Error terminating employee:", err);
    res.status(500).json({
      resultdata: null,
      result: "error",
      message: "Server error while terminating employee"
    });
  }
};

// ✅ Reactivate terminated employee
exports.reactivateEmployee = async (req, res) => {
  try {
    const { employeeNumber } = req.params;
    
    if (!employeeNumber) {
      return res.status(400).json({
        resultdata: null,
        result: "error",
        message: "Employee number is required"
      });
    }

    const [result] = await db.query(
      "UPDATE employees SET isTerminated = false WHERE employeeNumber = ?",
      [employeeNumber]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        resultdata: null,
        result: "error",
        message: "Employee not found"
      });
    }

    res.json({
      resultdata: { employeeNumber },
      result: "success",
      message: "✅ Employee reactivated successfully"
    });
  } catch (err) {
    console.error("❌ Error reactivating employee:", err);
    res.status(500).json({
      resultdata: null,
      result: "error",
      message: "Server error while reactivating employee"
    });
  }
};

// ✅ Get only active employeeNumbers
exports.getActiveEmployeeNumbers = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT employeeNumber, employeeName FROM employees WHERE isTerminated = false ORDER BY employeeName"
    );
    
    res.json({
      resultdata: rows,
      result: "success",
      message: rows.length > 0 
        ? `✅ Found ${rows.length} active employee numbers` 
        : "No active employees found"
    });
  } catch (err) {
    console.error("❌ Error fetching employee numbers:", err);
    res.status(500).json({
      resultdata: null,
      result: "error",
      message: "Server error while fetching employee numbers"
    });
  }
};

// ✅ Delete employee permanently
exports.deleteEmployee = async (req, res) => {
  try {
    const { employeeNumber } = req.params;
    
    if (!employeeNumber) {
      return res.status(400).json({
        resultdata: null,
        result: "error",
        message: "Employee number is required"
      });
    }

    const [result] = await db.query(
      "DELETE FROM employees WHERE employeeNumber = ?",
      [employeeNumber]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        resultdata: null,
        result: "error",
        message: "Employee not found"
      });
    }

    res.json({
      resultdata: { employeeNumber },
      result: "success",
      message: "✅ Employee deleted permanently"
    });
  } catch (err) {
    console.error("❌ Error deleting employee:", err);
    res.status(500).json({
      resultdata: null,
      result: "error",
      message: "Server error while deleting employee"
    });
  }
};