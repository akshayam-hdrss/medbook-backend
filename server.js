const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

(async () => {
  try {
    // Initialize DB and set to global
    global.db = await connectDB();

    // Import routes only after DB is ready
    const hospitalRoutes = require('./routes/hospitalRoutes');
    const uploadRoutes = require('./routes/uploadRoutes');
    const doctorTypeRoutes = require('./routes/doctorTypeRoutes');


    // Mount routes
    app.use('/api', uploadRoutes);
    app.use('/api', hospitalRoutes);
    app.use('/api/doctorType', doctorTypeRoutes);
    
    app.listen(port, () => {
      console.log(`🚀 Server running at port ${port}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
  }
})();
