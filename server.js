const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const http = require('http'); // 👈 add this
const { initSocket } = require('./middleware/socket'); // 👈 import socket init

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
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
    const hospitalInformationRoutes = require("./routes/hospitalInformationRoute");
    const quiz_question = require("./routes/quizRoutes");
    const quizUserDataRoutes = require("./routes/quiz_userdataroutes");
    const employeeRoutes = require('./routes/employeeRoutes');
    const membershipRoutes = require("./routes/membershipRoutes");




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
    app.use("/api/hospital-information", hospitalInformationRoutes);
    app.use("/api/quiz-userdata", quizUserDataRoutes);
    app.use('/api/employees', employeeRoutes);
    app.use("/api/memberships", membershipRoutes);
    app.use('/api/offers', offerRoutes);
    app.use('/api', uploadRoutes);
    app.use('/api', hospitalRoutes);
    app.use('/api', traditionalRoutes);
    app.use('/api', complaintRoutes);
    app.use('/api', whatsappRoutes);
    app.use('/api', primecareIconRoutes);
    app.use('/api', quiz_question)
    
   


    // ✅ Wrap app in HTTP server
    const server = http.createServer(app);

    // ✅ Initialize Socket.IO
    initSocket(server);

    // ✅ Start server
    server.listen(port, () => {
      console.log(`🚀 Server running at port ${port}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
  }
})();
