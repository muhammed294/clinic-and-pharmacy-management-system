const db = require('../config/db');

//POST create new prescription
exports.createPrescription = async (req, res) => {
    try {
        const { visit_id, doctor_id, medicine_name, dosage, notes } = req.body;

        if (!visit_id || !doctor_id || !medicine_name || !dosage) {
            return res.status(400).json({
                message: 'visit_id, doctor_id, dosage, and medicine_name are required!'
            })
        }

        const [visitIdCheck] = await db.query(
            'SELECT id FROM visit WHERE id = ?', [visit_id]);
            if (visitIdCheck.length === 0) {
                return res.status(400).json({
                    message: 'visit_id not found. Please check the visit ID.'
                });
            }

        const [doctorIdCheck] = await db.query(
            'SELECT id FROM doctor WHERE id = ?', [doctor_id]);
            if (doctorIdCheck.length === 0) {
                return res.status(400).json({
                    message: 'doctor_id not found. Please check the doctor ID.'
                });
            }    

        const [duplicateCheck] = await db.query('SELECT id FROM prescription WHERE visit_id = ?', [visit_id]);
            if (duplicateCheck.length > 0) {
                return res.status(400).json({
                message: 'Prescription already recorded for this visit.'
                });
            }

        const [result] = await db.query(
            'INSERT INTO prescription (visit_id, doctor_id, medicine_name, dosage, notes) VALUES (?,?,?,?,?)',
            [visit_id, doctor_id, medicine_name, dosage, notes]
        );

        res.status(201).json({
            id: result.insertId,
            message: 'Prescription created successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error creating prescription', 
            error: error.message
        });
    };
}

//GET all prescriptions
exports.getAllPrescription = async (req, res) => {
    try {
        const [prescriptions] = await db.query('SELECT * FROM prescription');
        res.json(prescriptions);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error fetching prescriptions', 
            error: error.message
        });
    };
}

//GET prescription by ID
exports.getPrescriptionByID = async (req, res) => {
    try {
        const { id } = req.params;

        const [prescription] = await db.query('SELECT * FROM prescription WHERE id = ?', [id]);

        if (prescription.length === 0) {
            return res.status(404).json({
                message: 'prescription not found'
            });
        }
        
        res.json(prescription[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error fetching prescription',
            error: error.message
        });
    }
}

//PUT prescription by ID
exports.updatePrescriptionByID = async (req, res) => {
    try {
        const { visit_id, doctor_id, medicine_name, dosage, notes } = req.body;

        const { id } = req.params;

        const [existing] = await db.query('SELECT * FROM prescription WHERE id = ?', [id]);

        if (existing.length === 0) {
            return res.status(404).json({
                message: 'Prescription not found'
            });
        } 

        const [visitIdCheck] = await db.query(
            'SELECT id FROM visit WHERE id = ?', [visit_id]);
            if (visitIdCheck.length === 0) {
                return res.status(400).json({
                    message: 'visit_id not found. Please check the visit ID.'
                });
            }

        const [doctorIdCheck] = await db.query(
            'SELECT id FROM doctor WHERE id = ?', [doctor_id]);
            if (doctorIdCheck.length === 0) {
                return res.status(400).json({
                    message: 'doctor_id not found. Please check the doctor ID.'
                });
            }

        await db.query(
            'UPDATE prescription SET visit_id = ?, doctor_id = ?, medicine_name = ?, dosage = ?, notes = ?  WHERE id = ?',
            [visit_id, doctor_id, medicine_name, dosage, notes, id]
        );

        res.json({
            message: 'updated successful'
        })
            
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error fetching prescription',
            error: error.message
        });
    }
}

//DELETE prescription by ID
exports.deletePrescriptionByID = async (req, res) => {
    try {
        const { id } = req.params;

        const [checkExisting] = await db.query('SELECT * FROM prescription WHERE id = ?', [id]);

        if (checkExisting.length === 0) {
            return res.status(404).json({
                message: 'Prescription not found'
            });
        } 

        await db.query(
            'DELETE FROM prescription WHERE id = ?',
            [id]
        );

        res.json({
            message: 'Prescription deleted successfully'
        })
            
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error deleting prescription',
            error: error.message
        });
    }
}