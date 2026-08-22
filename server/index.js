const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const medicineRoutes = require('./routes/medicineRoutes');
app.use('/medicines', medicineRoutes);

app.get('/', (req, res) => {
    res.send('Clinic & Pharmacy API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`running on http://localhost:${PORT}`);
});

