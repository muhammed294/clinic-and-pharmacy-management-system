const db = require('../config/db');

//POST create new payment
exports.createPayment = async (req, res) => {
    const connection = await db.getConnection();
    try {
        const { visit_id, payment_type, amount, payment_method, transaction_reference, collected_by, lab_request_id } = req.body;

        if (!visit_id || !payment_type || !amount || !payment_method || !collected_by) {
            return res.status(400).json({
                message: 'visit_id, payment_type, amount, payment_method, and collected_by are required!'
            });
        }

        const validPaymentType = ['registration', 'lab'];
        if (!validPaymentType.includes(payment_type)) {
            return res.status(400).json({ message: 'invalid payment_type!' });
        }

        const validPaymentMethods = ['cash', 'telebirr', 'cbe_birr', 'boa'];
        if (!validPaymentMethods.includes(payment_method)) {
            return res.status(400).json({ message: 'invalid payment_method!' });
        }

        const [visitIdCheck] = await connection.query(
            'SELECT id FROM visit WHERE id = ?', [visit_id]);
        if (visitIdCheck.length === 0) {
            return res.status(400).json({ message: 'Visit ID not found. Please check the visit ID.' });
        }

        const [collectedByIdCheck] = await connection.query(
            'SELECT id FROM user WHERE id = ?', [collected_by]);
        if (collectedByIdCheck.length === 0) {
            return res.status(400).json({ message: 'user id not found. Please check the user ID.' });
        }

        if (payment_type === 'lab') {
            if (!lab_request_id) {
                return res.status(400).json({
                    message: 'lab_request_id is required for lab payments.'
                });
            }

            const [labRequestRow] = await connection.query(
                'SELECT id, visit_id, status FROM labrequest WHERE id = ?', [lab_request_id]);

            if (labRequestRow.length === 0) {
                return res.status(400).json({ message: 'Lab request not found.' });
            }

            if (labRequestRow[0].visit_id !== visit_id) {
                return res.status(400).json({
                    message: 'This lab request does not belong to the given visit.'
                });
            }
        }

        await connection.beginTransaction();

        const [result] = await connection.query(
            'INSERT INTO payment (visit_id, payment_type, amount, payment_method, transaction_reference, collected_by, lab_request_id) VALUES (?,?,?,?,?,?,?)',
            [visit_id, payment_type, amount, payment_method, transaction_reference, collected_by, lab_request_id || null]
        );

        if (payment_type === 'lab') {
            await connection.query(
                'UPDATE labrequest SET status = ? WHERE id = ?',
                ['payment_approved', lab_request_id]
            );
        }

        await connection.commit();

        res.status(201).json({
            id: result.insertId,
            message: 'Payment recorded successfully.'
        });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({
            message: 'Error recording payment.',
            error: error.message
        });
    } finally {
        connection.release();
    }
};

//GET all payment
exports.getAllPayment = async (req, res) => {
    try {
        const [payment] = await db.query('SELECT * FROM payment');
        res.json(payment);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error fetching payment', 
            error: error.message
        });
    };
}

//GET payment by ID
exports.getPaymentByID = async (req, res) => {
    try {
        const { id } = req.params;

        const [payment] = await db.query('SELECT * FROM payment WHERE id = ?', [id]);

        if (payment.length === 0) {
            return res.status(404).json({
                message: 'Payment not found'
            });
        }
        
        res.json(payment[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error fetching payment',
            error: error.message
        });
    }
}

//PUT payment by ID
exports.updatePaymentByID = async (req, res) => {
    try {
        const { visit_id , payment_type, amount, payment_method, transaction_reference, collected_by } = req.body;

        const { id } = req.params;

        const [existing] = await db.query('SELECT * FROM payment WHERE id = ?', [id]);

        if (existing.length === 0) {
            return res.status(404).json({
                message: 'Payment not found'
            });
        } 

        const [visitIdCheck] = await db.query(
            'SELECT id FROM visit WHERE id = ?', [visit_id]);
        if (visitIdCheck.length === 0) {
            return res.status(400).json({
                message: 'Visit ID not found. Please check the lab visit ID.'
            });
        }

        const [collactedByIdCheck] = await db.query(
            'SELECT id FROM user WHERE id = ?', [collected_by]);
        if (collactedByIdCheck.length === 0) {
            return res.status(400).json({
                message: 'user id not found. Please check the user ID.'
            });
        }

        await db.query(
            'UPDATE payment SET visit_id = ?, payment_type = ?, amount = ?, payment_method = ?, transaction_reference = ?, collected_by = ? WHERE id = ?',
            [visit_id , payment_type, amount, payment_method, transaction_reference, collected_by, id]
        );

        res.json({
            message: 'updated successful'
        })
            
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error fetching payment fee',
            error: error.message
        });
    }
}

//DELETE payment by ID
exports.deletePaymentByID = async (req, res) => {
    try {
        const { id } = req.params;

        const [checkExisting] = await db.query('SELECT * FROM payment WHERE id = ?', [id]);

        if (checkExisting.length === 0) {
            return res.status(404).json({
                message: 'Payment not found'
            });
        } 

        await db.query(
            'DELETE FROM payment WHERE id = ?',
            [id]
        );

        res.json({
            message: 'Payment deleted successfully'
        })
            
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error deleting Payment',
            error: error.message
        });
    }
}