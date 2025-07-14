const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
app.use(cors());

app.use(express.json());

(async () => {
  try {
    // Initialize DB and set to global
    global.db = await connectDB();

    // Import routes only after DB is ready
    const hospitalRoutes = require('./routes/hospitalRoutes');
    const uploadRoutes = require('./routes/uploadRoutes');
    const doctorTypeRoutes = require('./routes/doctorTypeRoutes');
    const doctorRoutes = require('./routes/doctorRoutes');
    const serviceRoutes = require('./routes/serviceRoutes');
    const productRoutes = require('./routes/productRoutes');


    // Mount routes
    app.use('/api', uploadRoutes);
    app.use('/api', hospitalRoutes);
    app.use('/api/doctorType', doctorTypeRoutes);
    app.use('/api/doctor', doctorRoutes);
    app.use('/api/services', serviceRoutes);
    app.use('/api/product', productRoutes);


    
    app.listen(port, () => {
      console.log(`🚀 Server running at port ${port}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
  }
})();
