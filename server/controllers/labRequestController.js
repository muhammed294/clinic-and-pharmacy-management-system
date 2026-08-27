const db = require('../config/db');

//POST create new lab Request
exports.createLabRequest = async (req, res) => {
    try {
        const { visit_id, doctor_id, test_name, approved_by } = req.body;

        if (!visit_id || !doctor_id || !test_name) {
            return res.status(400).json({
                message: 'visit_id, doctor_id, and test_name, are required!'
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
        
        const status = 'requested';

        const [result] = await db.query(
            'INSERT INTO labrequest (visit_id, doctor_id, test_name, status, approved_by) VALUES (?,?,?,?,?)',
            [visit_id, doctor_id, test_name, status, approved_by]
        );

        res.status(201).json({
            id: result.insertId,
            message: 'Lab request created successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error creating lab request', 
            error: error.message
        });
    };
}

//GET all lab requests
exports.getAllLabRequest = async (req, res) => {
    try {
        const [labrequests] = await db.query('SELECT * FROM labrequest');
        res.json(labrequests);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error fetching lab requests', 
            error: error.message
        });
    };
}

//GET lab request by ID
exports.getLabRequestByID = async (req, res) => {
    try {
        const { id } = req.params;

        const [labrequest] = await db.query('SELECT * FROM labrequest WHERE id = ?', [id]);

        if (labrequest.length === 0) {
            return res.status(404).json({
                message: 'Lab request not found'
            });
        }
        
        res.json(labrequest[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error fetching lab request',
            error: error.message
        });
    }
}

//PUT lab request by ID
exports.updateLabRequestByID = async (req, res) => {
    try {
        const { visit_id, doctor_id, test_name, status, approved_by } = req.body;

        const { id } = req.params;

        const [existing] = await db.query('SELECT * FROM labrequest WHERE id = ?', [id]);

        if (existing.length === 0) {
            return res.status(404).json({
                message: 'Lab request not found'
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

        const validstatus = ['payment_pending', 'payment_approved', 'in_progress', 'result_ready', 'sent_to_doctor'];

        if (!validstatus.includes(status)) {
            return res.status(400).json({
                message: 'Not valid status'
            });
        }

        await db.query(
            'UPDATE labrequest SET visit_id = ?, doctor_id = ?, test_name = ?, status = ?, approved_by = ?  WHERE id = ?',
            [visit_id, doctor_id, test_name, status, approved_by, id]
        );

        res.json({
            message: 'updated successful'
        })
            
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error fetching lab request',
            error: error.message
        });
    }
}

//DELETE lab request by ID
exports.deleteLabRequestByID = async (req, res) => {
    try {
        const { id } = req.params;

        const [checkExisting] = await db.query('SELECT * FROM labrequest WHERE id = ?', [id]);

        if (checkExisting.length === 0) {
            return res.status(404).json({
                message: 'Lab request not found'
            });
        } 

        await db.query(
            'DELETE FROM labrequest WHERE id = ?',
            [id]
        );

        res.json({
            message: 'Lab Request deleted successfully'
        })
            
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error deleting lab request',
            error: error.message
        });
    }
}