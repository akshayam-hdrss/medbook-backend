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
    const categoryRoutes = require('./routes/categoryRoutes');
    const complaintRoutes = require('./routes/complaintRoutes');
    const userRoutes = require('./routes/userRoutes');
    const blogRoutes = require('./routes/blogRoutes');
    const adsRoutes = require('./routes/galleryRoutes');
    const whatsappRoutes = require('./routes/whatsappRoutes');
    const scheduleRoutes = require('./routes/scheduleRoutes');
    const charityRoutes = require('./routes/charityRoutes');
    const eventRoutes = require('./routes/eventRoutes');
    const districtAreaRoutes = require('./routes/districtAreaRoutes');
    const traditionalRoutes = require('./routes/traditionalRoutes');
    const primecareIconRoutes = require('./routes/primecareIconRoutes');
    const offerRoutes = require('./routes/offersRoutes');
    const bookingRoutes = require('./routes/bookingRoutes');



    // Mount routes
    app.get('/', (req, res) => {
      res.send('✅ API is live and running...');
    });
    app.use('/api/schedule', scheduleRoutes);
    
    app.use('/api/doctorType', doctorTypeRoutes);
    app.use('/api/doctor', doctorRoutes);
    app.use('/api/services', serviceRoutes);
    app.use('/api/products', productRoutes);
    app.use('/api/category', categoryRoutes);
    app.use('/api/user', userRoutes);
    app.use('/api/ads', adsRoutes);
    app.use('/api/blog', blogRoutes);
    app.use('/api/charities', charityRoutes);
    app.use('/api/event', eventRoutes);
    app.use('/api/district-area', districtAreaRoutes);
    app.use('/api/bookings', bookingRoutes);
    app.use('/api', uploadRoutes);
    app.use('/api', hospitalRoutes);
    app.use('/api', traditionalRoutes);
    app.use('/api', complaintRoutes);
    app.use('/api', whatsappRoutes);
    app.use('/api', primecareIconRoutes);
    app.use('/api/offers', offerRoutes);


    app.listen(port, () => {
      console.log(`🚀 Server running at port ${port}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
  }
})();
