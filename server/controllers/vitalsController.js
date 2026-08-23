const db = require('../config/db');

//POST create new vitals
exports.createVitals = async (req, res) => {
    try {
        const { visit_id , weight, body_temperature } = req.body;

        if (!visit_id || !weight || !body_temperature) {
            return res.status(400).json({
                message: 'visit_id, weight, and body_temperature are required!'
            })
        }

        const [visitIdCheck] = await db.query(
            'SELECT id FROM visit WHERE id = ?', [visit_id]);
            if (visitIdCheck.length === 0) {
                return res.status(400).json({
                    message: 'visit_id not found. Please check the visit ID.'
                });
            }

        const [duplicateCheck] = await db.query('SELECT id FROM vitals WHERE visit_id = ?', [visit_id]);
            if (duplicateCheck.length > 0) {
                return res.status(400).json({
                message: 'Vitals already recorded for this visit.'
                });
            }

        const [result] = await db.query(
            'INSERT INTO vitals (visit_id , weight, body_temperature) VALUES (?,?,?)',
            [visit_id , weight, body_temperature]
        );

        res.status(201).json({
            id: result.insertId,
            message: 'Vitals created successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error creating vitals', 
            error: error.message
        });
    };
}

//GET all vitals
exports.getAllVitals = async (req, res) => {
    try {
        const [vitals] = await db.query('SELECT * FROM vitals');
        res.json(vitals);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error fetching vitals', 
            error: error.message
        });
    };
}

//GET vitals by ID
exports.getVitalsByID = async (req, res) => {
    try {
        const { id } = req.params;

        const [vitals] = await db.query('SELECT * FROM vitals WHERE id = ?', [id]);

        if (vitals.length === 0) {
            return res.status(404).json({
                message: 'Vitals not found'
            });
        }
        
        res.json(vitals[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error fetching vitals',
            error: error.message
        });
    }
}

//PUT vitals by ID
exports.updateVitalsByID = async (req, res) => {
    try {
        const { visit_id , weight, body_temperature } = req.body;

        const { id } = req.params;

        const [existing] = await db.query('SELECT * FROM vitals WHERE id = ?', [id]);

        if (existing.length === 0) {
            return res.status(404).json({
                message: 'Vitals not found'
            });
        } 

        const [visitIdCheck] = await db.query(
            'SELECT id FROM visit WHERE id = ?', [visit_id]);
            if (visitIdCheck.length === 0) {
                return res.status(400).json({
                    message: 'visit_id not found. Please check the visit ID.'
                });
            }

        await db.query(
            'UPDATE vitals SET visit_id = ?, weight = ?, body_temperature = ?  WHERE id = ?',
            [visit_id , weight, body_temperature, id]
        );

        res.json({
            message: 'updated successful'
        })
            
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error fetching vitals',
            error: error.message
        });
    }
}

//DELETE vitals by ID
exports.deleteVitalsByID = async (req, res) => {
    try {
        const { id } = req.params;

        const [checkExisting] = await db.query('SELECT * FROM vitals WHERE id = ?', [id]);

        if (checkExisting.length === 0) {
            return res.status(404).json({
                message: 'Vitals not found'
            });
        } 

        await db.query(
            'DELETE FROM vitals WHERE id = ?',
            [id]
        );

        res.json({
            message: 'Vitals deleted successfully'
        })
            
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error deleting vitals',
            error: error.message
        });
    }
}