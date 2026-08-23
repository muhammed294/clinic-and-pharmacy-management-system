const db = require('../config/db');

//POST create new visit
exports.createVisit = async (req, res) => {
    try {
        const { patient_id, doctor_id , department, visit_type, created_by  } = req.body;

        const status = 'registered';

        if (!patient_id || !doctor_id || !department || !visit_type || !created_by) {
            return res.status(400).json({
                message: 'patient_id, doctor_id, department, visit_type, and created_by are required!'
            })
        }

        const validDepartments = ['child', 'adult', 'emergency'];

        if (!validDepartments.includes(department)) {
            return res.status(400).json({
                message: 'invalid department!'
            });
        }

        const validVisitTypes = ['normal', 'emergency'];

        if (!validVisitTypes.includes(visit_type)) {
            return res.status(400).json({
                message: 'invalid visit_type!'
            });
        }

        const validstatus = ['registered', 'vitals_done', 'with_doctor', 'lab_pending', 'completed'];

        if (!validstatus.includes(status)) {
            return res.status(400).json({
                message: 'invalid status!'
            });
        }

        const [patientCheck] = await db.query('SELECT id FROM patient WHERE id = ?', [patient_id]);
        if (patientCheck.length === 0) {
            return res.status(400).json({
                message: 'Patient not found. Please check the patient ID.'
            });
        }

        const [doctorCheck] = await db.query('SELECT id FROM doctor WHERE id = ?', [doctor_id]);
        if (doctorCheck.length === 0) {
            return res.status(400).json({
                message: 'Doctor not found. Please check the doctor ID.'
            });
        }

        const [result] = await db.query(
            'INSERT INTO visit (patient_id, doctor_id , department, visit_type, status, created_by) VALUES (?,?,?,?,?,?)',
            [patient_id, doctor_id , department, visit_type, status, created_by]
        );

        res.status(201).json({
            id: result.insertId,
            message: 'Visit created successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error creating visit', 
            error: error.message
        });
    };
}

//GET all visits
exports.getAllVsits = async (req, res) => {
    try {
        const [visits] = await db.query('SELECT * FROM visit');
        res.json(visits);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error fetching visits', 
            error: error.message
        });
    };
}

//GET visit by ID
exports.getVisitByID = async (req, res) => {
    try {
        const { id } = req.params;

        const [visit] = await db.query('SELECT * FROM visit WHERE id = ?', [id]);

        if (visit.length === 0) {
            return res.status(404).json({
                message: 'Visit not found'
            });
        }
        
        res.json(visit[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error fetching visit',
            error: error.message
        });
    }
}

//PUT visit by ID
exports.updateVisitByID = async (req, res) => {
    try {
        const { patient_id, doctor_id , department, visit_type, status, created_by } = req.body;

        const { id } = req.params;

        const [existing] = await db.query('SELECT * FROM visit WHERE id = ?', [id]);

        if (existing.length === 0) {
            return res.status(404).json({
                message: 'Visit not found'
            });
        } 

        const validDepartments = ['child', 'adult', 'emergency'];

        if (!validDepartments.includes(department)) {
            return res.status(400).json({
                message: 'invalid department!'
            });
        }

        const validVisitTypes = ['normal', 'emergency'];

        if (!validVisitTypes.includes(visit_type)) {
            return res.status(400).json({
                message: 'invalid visit_type!'
            });
        }

        const validstatus = ['registered', 'vitals_done', 'with_doctor', 'lab_pending', 'completed'];

        if (!validstatus.includes(status)) {
            return res.status(400).json({
                message: 'invalid status!'
            });
        }

        const [patientCheck] = await db.query('SELECT id FROM patient WHERE id = ?', [patient_id]);
        if (patientCheck.length === 0) {
            return res.status(400).json({
                message: 'Patient not found. Please check the patient ID.'
            });
        }

        const [doctorCheck] = await db.query('SELECT id FROM doctor WHERE id = ?', [doctor_id]);
        if (doctorCheck.length === 0) {
            return res.status(400).json({
                message: 'Doctor not found. Please check the doctor ID.'
            });
        }

        await db.query(
            'UPDATE visit SET patient_id = ?, doctor_id = ?, department = ?, visit_type = ?, status = ?, created_by = ?  WHERE id = ?',
            [patient_id, doctor_id , department, visit_type, status, created_by, id]
        );

        res.json({
            message: 'updated successful'
        });
            
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error fetching visit',
            error: error.message
        });
    }
}

//DELETE visit by ID
exports.deleteVisitByID = async (req, res) => {
    try {
        const { id } = req.params;

        const [checkExisting] = await db.query('SELECT * FROM visit WHERE id = ?', [id]);

        if (checkExisting.length === 0) {
            return res.status(404).json({
                message: 'Visit not found'
            });
        } 

        await db.query(
            'DELETE FROM visit WHERE id = ?',
            [id]
        );

        res.json({
            message: 'Visit deleted successfully'
        });
            
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error deleting visit',
            error: error.message
        });
    }
}