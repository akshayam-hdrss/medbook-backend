const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");

// Routes
router.post("/", employeeController.createEmployee); // POST /api/employees
router.get("/", employeeController.getAllEmployees); // GET /api/employees
router.get("/terminated", employeeController.getTerminatedEmployees); // GET /api/employees/terminated
router.get("/numbers/active", employeeController.getActiveEmployeeNumbers); // GET /api/employees/numbers/active
router.get("/:employeeNumber", employeeController.getEmployeeByNumber); // GET /api/employees/EMP001
router.put("/:employeeNumber", employeeController.updateEmployee); // PUT /api/employees/EMP001
router.put("/:employeeNumber/terminate", employeeController.terminateEmployee); // PUT /api/employees/EMP001/terminate

module.exports = router;
