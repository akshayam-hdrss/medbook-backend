// const express = require('express');
// const router = express.Router();
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// router.post('/signup', async (req, res) => {
//   const {
//     name,
//     email,
//     password,
//     phone,
//     pincode,
//     gender,
//     dob,
//     block,
//     district,
//     state,
//     address
//   } = req.body;

//   try {
//     const [existing] = await global.db.query('SELECT * FROM users WHERE email = ?', [email]);
//     if (existing.length > 0) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const [result] = await global.db.query(
//       `INSERT INTO users (name, email, password, phone, pincode, gender, dob, block, district, state, address)
//        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [name, email, hashedPassword, phone, pincode, gender, dob, block, district, state, address]
//     );

//     res.json({ message: 'User registered successfully', userId: result.insertId });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Signup failed' });
//   }
// });


// // LOGIN
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const [users] = await global.db.query('SELECT * FROM users WHERE email = ?', [email]);
//     if (users.length === 0) return res.status(404).json({ message: 'User do not exist' });

//     const user = users[0];
//     const valid = await bcrypt.compare(password, user.password);
//     if (!valid) return res.status(401).json({ message: 'Invalid password' });

//     // Generate token WITHOUT iat or exp
//     const token = jwt.sign(
//       { id: user.id, name: user.name, email: user.email },
//       process.env.JWT_SECRET,
//       { noTimestamp: true } // disables `iat`
//     );

//     res.json({ message: 'Login successful', token });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Login failed' });
//   }
// });

// // PROTECTED PROFILE
// router.get('/profile', authenticateToken, async (req, res) => {
//   try {
//     const [rows] = await global.db.query(
//   `SELECT id, name, email, phone, pincode, gender, dob, block, district, state, address, createdAt
//    FROM users WHERE id = ?`,
//   [req.user.id]
// );


//     if (rows.length === 0) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.json({ user: rows[0] });
//   } catch (err) {
//     console.error("Profile fetch error:", err);
//     res.status(500).json({ message: 'Error fetching profile' });
//   }
// });




// // JWT Middleware
// function authenticateToken(req, res, next) {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader?.split(' ')[1];
//   if (!token) return res.status(401).json({ message: 'No token' });

//   jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true }, (err, user) => {
//     if (err) return res.status(403).json({ message: 'Invalid token' });
//     req.user = user;
//     next();
//   });
// }

// module.exports = router;



const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ====================== SIGNUP ======================
router.post('/signup', async (req, res) => {
  const { name, phone, password, pincode, dob } = req.body;

  if (!name || !phone || !password || !pincode || !dob) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (!/^\d{10}$/.test(phone)) return res.status(400).json({ message: 'Invalid mobile number' });
  if (!/^\d{6}$/.test(pincode)) return res.status(400).json({ message: 'Invalid pincode' });

  try {
    const [existing] = await global.db.query('SELECT * FROM users WHERE phone = ?', [phone]);

    if (existing.length > 0) {
      return res.status(400).json({ message: 'Mobile number already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await global.db.query(
      `INSERT INTO users (name, phone, password, pincode, dob)
       VALUES (?, ?, ?, ?, ?)`,
      [name, phone, hashedPassword, pincode, dob]
    );

    res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: 'Signup failed' });
  }
});

// ====================== LOGIN ======================
router.post('/login', async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.status(400).json({ message: 'Mobile number and password are required' });
  }

  try {
    const [users] = await global.db.query('SELECT * FROM users WHERE phone = ?', [phone]);

    if (users.length === 0) return res.status(404).json({ message: 'User does not exist' });

    const user = users[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign(
      { id: user.id, name: user.name, phone: user.phone },
      process.env.JWT_SECRET,
      { noTimestamp: true }
    );

    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: 'Login failed' });
  }
});

// ====================== RESET PASSWORD ======================
router.post('/reset-password', async (req, res) => {
  const { phone, newPassword } = req.body;

  if (!phone || !newPassword) {
    return res.status(400).json({ message: 'Mobile number and new password are required' });
  }

  try {
    const [users] = await global.db.query('SELECT * FROM users WHERE phone = ?', [phone]);

    if (users.length === 0) return res.status(404).json({ message: 'Mobile number not found' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await global.db.query('UPDATE users SET password = ? WHERE phone = ?', [hashedPassword, phone]);

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: 'Failed to reset password' });
  }
});

// ====================== PROFILE ======================
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const [rows] = await global.db.query(
      `SELECT id, name, phone, pincode, dob, isDoctor, isProduct, isPharmacy, isLab, isService, createdAt FROM users WHERE id = ?`,
      [req.user.id]
    );

    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });

    res.json({ user: rows[0] });
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// ====================== UPDATE USER ROLE ======================
router.put('/role', async (req, res) => {
  const { id, isDoctor, isPharmacy, isProduct, isLab, isService } = req.body;

  if (!id) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  const roles = [isDoctor, isPharmacy, isProduct , isLab, isService];
  console.log("roles:",roles);
  const trueCount = roles.filter(r => r === true).length;
  console.log("trueCount:",trueCount);

  if (trueCount !== 1) {
    return res.status(400).json({ message: 'Only one role must be selected as true' });
  }

  try {
    const query = `UPDATE users 
      SET isDoctor = ?, isPharmacy = ?, isProduct = ?, isLab = ?, isService = ? 
      WHERE id = ?`;

    await global.db.query(query, [
      isDoctor ? true : false,
      isPharmacy ? true : false,
      isProduct ? true : false,
      isLab ? true : false,
      isService ? true : false,
      id
    ]);

    res.status(200).json({ message: 'User role updated successfully' });
  } catch (err) {
    console.error("Update role error:", err);
    res.status(500).json({ message: 'Failed to update role' });
  }
});

// ====================== GET USERS BY ROLE WITH SERVICE DETAILS ======================
router.get('/users-by-role', async (req, res) => {
  const { isPharmacy, isLab } = req.query; // expects ?isPharmacy=true or ?isLab=true

  try {
    // Base query
    let query = `
      SELECT 
        u.id AS userId,
        u.name AS userName,
        u.phone AS userPhone,
        u.isPharmacy,
        u.isLab,
        s.id AS serviceId,
        s.serviceName,
        s.businessName,
        s.location,
        s.phone AS servicePhone,
        s.experience,
        s.addressLine1,
        s.addressLine2,
        s.mapLink,
        s.about,
        s.youtubeLink,
        s.gallery,
        s.bannerUrl,
        s.district,
        s.pincode
      FROM users u
      LEFT JOIN service s ON u.phone = s.phone
      WHERE 1=1
    `;

    const params = [];

    // Filter conditions
    if (isPharmacy === 'true') {
      query += ` AND u.isPharmacy = true`;
    }

    if (isLab === 'true') {
      query += ` AND u.isLab = true`;
    }

    // Prevent both true at once (optional)
    if (isPharmacy === 'true' && isLab === 'true') {
      return res
        .status(400)
        .json({ message: 'Please filter by only one role at a time (isPharmacy or isLab)' });
    }

    // Execute query
    const [rows] = await global.db.query(query, params);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No matching users found' });
    }

    res.status(200).json({ users: rows });
  } catch (err) {
    console.error('Error fetching users by role with service:', err);
    res.status(500).json({ message: 'Error fetching users' });
  }
});


//get one availableProduct by phone number
router.get('/getshop', async (req, res) => {
  const { phone } = req.query;
  if (!phone) {
    return res.status(400).json({ message: 'Phone number is required' });
  }
  try {
    const [rows] = await global.db.query(
      "SELECT * FROM availableProduct WHERE phoneNumber = ?",
      [phone]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No Shop found for this phone number' });
    }
    res.json({ availableProduct: rows });
  } catch (err) {
    console.error('❌ Error fetching availableProduct:', err);
    res.status(500).json({ message: 'Error fetching availableProduct' });
  }
});


// ====================== JWT Middleware ======================
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true }, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
}

module.exports = router;
