const db = require('../config/db');

//POST create new lab Result
exports.createLabResult = async (req, res) => {
    const connection = await db.getConnection();
    try {
        const { lab_request_id, result_details, performed_by, sent_to_doctor_at } = req.body;

        if (!lab_request_id || !result_details) {
            return res.status(400).json({
                message: 'lab_request_id, and result_details are required!'
            });
        }

        const [labRequestIdCheck] = await connection.query(
            'SELECT id FROM labrequest WHERE id = ?', [lab_request_id]);
        if (labRequestIdCheck.length === 0) {
            return res.status(400).json({
                message: 'lab Request_id not found. Please check the lab Request ID.'
            });
        }

        const [laboratoryIdCheck] = await connection.query(
            'SELECT id FROM user WHERE id = ?', [performed_by]);
        if (laboratoryIdCheck.length === 0) {
            return res.status(400).json({
                message: 'laboratory id not found. Please check the laboratory ID.'
            });
        }

        const [duplicateCheck] = await connection.query(
            'SELECT id FROM labresult WHERE lab_request_id = ?', [lab_request_id]);
        if (duplicateCheck.length > 0) {
            return res.status(400).json({
                message: 'Lab result already recorded for this lab request.'
            });
        }

        await connection.beginTransaction();

        const [result] = await connection.query(
            'INSERT INTO labresult (lab_request_id, result_details, performed_by, sent_to_doctor_at) VALUES (?,?,?,?)',
            [lab_request_id, result_details, performed_by, sent_to_doctor_at]
        );

        await connection.query(
            'UPDATE labrequest SET status = ? WHERE id = ?',
            ['result_ready', lab_request_id]
        );

        await connection.commit();

        res.status(201).json({
            id: result.insertId,
            message: 'Lab result created successfully, lab request marked as result_ready'
        });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({
            message: 'Error creating lab result',
            error: error.message
        });
    } finally {
        connection.release();
    }
};

//GET all lab result
exports.getAllLabResult = async (req, res) => {
    try {
        const [labresults] = await db.query('SELECT * FROM labresult');
        res.json(labresults);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error fetching lab results', 
            error: error.message
        });
    };
}

//GET lab result by ID
exports.getLabResultByID = async (req, res) => {
    try {
        const { id } = req.params;

        const [labresult] = await db.query('SELECT * FROM labresult WHERE id = ?', [id]);

        if (labresult.length === 0) {
            return res.status(404).json({
                message: 'Lab result not found'
            });
        }
        
        res.json(labresult[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error fetching lab result',
            error: error.message
        });
    }
}

//PUT lab result by ID
exports.updateLabResultByID = async (req, res) => {
    try {
        const { lab_request_id , result_details, performed_by , sent_to_doctor_at } = req.body;

        const { id } = req.params;

        const [existing] = await db.query('SELECT * FROM labresult WHERE id = ?', [id]);

        if (existing.length === 0) {
            return res.status(404).json({
                message: 'Lab result not found'
            });
        } 

        const [labRequestIdCheck] = await db.query(
            'SELECT id FROM labrequest WHERE id = ?', [lab_request_id]);
        if (labRequestIdCheck.length === 0) {
            return res.status(400).json({
                message: 'lab Request_id not found. Please check the lab Request ID.'
            });
        }

        const [laboratoryIdCheck] = await db.query(
            'SELECT id FROM user WHERE id = ?', [performed_by]);
        if (laboratoryIdCheck.length === 0) {
            return res.status(400).json({
                message: 'laboratory id not found. Please check the laboratory ID.'
            });
        }  

        await db.query(
            'UPDATE labresult SET lab_request_id = ?, result_details = ?, performed_by = ?, sent_to_doctor_at = ? WHERE id = ?',
            [lab_request_id , result_details, performed_by , sent_to_doctor_at, id]
        );

        res.json({
            message: 'updated successful'
        })
            
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error fetching lab result',
            error: error.message
        });
    }
}

//DELETE lab result by ID
exports.deleteLabResultByID = async (req, res) => {
    try {
        const { id } = req.params;

        const [checkExisting] = await db.query('SELECT * FROM labresult WHERE id = ?', [id]);

        if (checkExisting.length === 0) {
            return res.status(404).json({
                message: 'Lab result not found'
            });
        } 

        await db.query(
            'DELETE FROM labresult WHERE id = ?',
            [id]
        );

        res.json({
            message: 'Lab result deleted successfully'
        })
            
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error deleting lab result',
            error: error.message
        });
    }
}