const db = require('../config/db');

//POST create new patient
exports.createPatient = async (req, res) => {
    try {
        const { card_number, first_name, last_name, age, phone_number, address } = req.body;

        if (!card_number || !first_name || !last_name || !age || !phone_number || !address) {
            return res.status(400).json({
                message: 'card_number, first_name, last_name, age, phone_number,  and address are required!'
            })
        }

        const [result] = await db.query(
            'INSERT INTO patient (card_number, first_name, last_name, age, phone_number, address) VALUES (?,?,?,?,?,?)',
            [card_number, first_name, last_name, age, phone_number, address]
        );

        res.status(201).json({
            id: result.insertId,
            message: 'Patient created successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error creating patient', 
            error: error.message
        });
    };
}

//GET all patients
exports.getAllPatients = async (req, res) => {
    try {
        const [patients] = await db.query('SELECT * FROM patient');
        res.json(patients);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error fetching patients', 
            error: error.message
        });
    };
}

//GET patient by ID
exports.getPatientByID = async (req, res) => {
    try {
        const { id } = req.params;

        const [patient] = await db.query('SELECT * FROM patient WHERE id = ?', [id]);

        if (patient.length === 0) {
            return res.status(404).json({
                message: 'Patient not found'
            });
        }
        
        res.json(patient[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error fetching patient',
            error: error.message
        });
    }
}

//PUT patient by ID
exports.updatePatientByID = async (req, res) => {
    try {
        const { card_number, first_name, last_name, age, phone_number, address } = req.body;

        const { id } = req.params;

        const [existing] = await db.query('SELECT * FROM patient WHERE id = ?', [id]);

        if (existing.length === 0) {
            return res.status(404).json({
                message: 'Patient not found'
            });
        } 

        await db.query(
            'UPDATE patient SET card_number = ?, first_name = ?, last_name = ?,age = ?, phone_number = ?, address = ?  WHERE id = ?',
            [card_number, first_name, last_name, age, phone_number, address, id]
        );

        res.json({
            message: 'updated successful'
        })
            
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error fetching patient',
            error: error.message
        });
    }
}

//DELETE Medicine by ID
exports.deletePatientByID = async (req, res) => {
    try {
        const { id } = req.params;

        const [checkExisting] = await db.query('SELECT * FROM patient WHERE id = ?', [id]);

        if (checkExisting.length === 0) {
            return res.status(404).json({
                message: 'Patient not found'
            });
        } 

        await db.query(
            'DELETE FROM patient WHERE id = ?',
            [id]
        );

        res.json({
            message: 'patient deleted successfully'
        })
            
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error deleting patient',
            error: error.message
        });
    }
}