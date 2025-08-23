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
      `SELECT id, name, phone, pincode, dob, isDoctor, createdAt FROM users WHERE id = ?`,
      [req.user.id]
    );

    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });

    res.json({ user: rows[0] });
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ message: 'Error fetching profile' });
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
