const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const authenticateToken = require('./middleware/authMiddleware');

//Routes
const medicineRoutes = require('./routes/medicineRoutes');
app.use('/medicines',authenticateToken, medicineRoutes);

const stockRoutes = require('./routes/stockRoutes');
app.use('/stock',authenticateToken, stockRoutes);

const pharmacySaleRoutes = require('./routes/pharmacySaleRoutes');
app.use('/pharmacySale',authenticateToken, pharmacySaleRoutes);

const saleItemRoutes = require('./routes/saleItemRoutes');
app.use('/saleItem',authenticateToken, saleItemRoutes);

const patientRoutes = require('./routes/patientRoutes');
app.use('/patient',authenticateToken, patientRoutes);

const doctorRoutes = require('./routes/doctorRoutes');
app.use('/doctor',authenticateToken, doctorRoutes);

const visitRoutes = require('./routes/visitRoutes');
app.use('/visit',authenticateToken, visitRoutes);

const vitalsRoutes = require('./routes/vitalsRoutes');
app.use('/vitals',authenticateToken, vitalsRoutes);

const prescriptionRoutes = require('./routes/prescriptionRoutes');
app.use('/prescription',authenticateToken, prescriptionRoutes);

const labRequestRoutes = require('./routes/labRequestRoutes');
app.use('/labrequest',authenticateToken, labRequestRoutes);

const labResultRoutes = require('./routes/labResultRoutes');
app.use('/labresult',authenticateToken, labResultRoutes);

const paymentRoutes = require('./routes/paymentRoutes');
app.use('/payment',authenticateToken, paymentRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/user', userRoutes);

app.get('/', (req, res) => {
    res.send('Clinic & Pharmacy API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`running on http://localhost:${PORT}`);
});

