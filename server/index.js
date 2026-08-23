const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const medicineRoutes = require('./routes/medicineRoutes');
app.use('/medicines', medicineRoutes);

const stockRoutes = require('./routes/stockRoutes');
app.use('/stock', stockRoutes);

const pharmacySaleRoutes = require('./routes/pharmacySaleRoutes');
app.use('/pharmacySale', pharmacySaleRoutes);

const saleItemRoutes = require('./routes/saleItemRoutes');
app.use('/saleItem', saleItemRoutes);

const patientRoutes = require('./routes/patientRoutes');
app.use('/patient', patientRoutes);

const doctorRoutes = require('./routes/doctorRoutes');
app.use('/doctor', doctorRoutes);

const visitRoutes = require('./routes/visitRoutes');
app.use('/visit', visitRoutes);

const vitalsRoutes = require('./routes/vitalsRoutes');
app.use('/vitals', vitalsRoutes);

const prescriptionRoutes = require('./routes/prescriptionRoutes');
app.use('/prescription', prescriptionRoutes);

app.get('/', (req, res) => {
    res.send('Clinic & Pharmacy API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`running on http://localhost:${PORT}`);
});

