const db = require('../config/db');

//POST create new pharmacySale
exports.createPharmacySale = async (req, res) => {
    try {
        const { sold_by, payment_method, transaction_reference } = req.body;

        if (!sold_by || !payment_method) {
            return res.status(400).json({
                message: 'sold_by and payment_method are required!'
            })
        }

        const [result] = await db.query(
            'INSERT INTO pharmacysale (sold_by, total_amount, payment_method, transaction_reference) VALUES (?,0,?,?)',
            [sold_by,  payment_method, transaction_reference || null]
        );

        res.status(201).json({
            id: result.insertId,
            message: 'Pharmacy sale created successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error creating Pharmacy sale', 
            error: error.message
        });
    };
}

//GET all pharmacy sale
exports.getAllPharmacySale = async (req, res) => {
    try {
        const [sales] = await db.query('SELECT * FROM pharmacysale');
        res.json(sales);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error fetching pharmacy sales',
            error: error.message
        });
    };
}

//GET pharmacy sale by ID
exports.getPharmacySaleByID = async (req, res) => {
    try {
        const { id } = req.params;

        const [pharmacysale] = await db.query('SELECT * FROM pharmacysale WHERE id = ?', [id]);

        if (pharmacysale.length === 0) {
            return res.status(404).json({
                message: 'Pharmacy sale not found'
            });
        }
        
        res.json(pharmacysale[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error fetching pharmacy sale',
            error: error.message
        });
    }
}

//PUT pharmacy sale by ID
exports.updatePharmacySaleByID = async (req, res) => {
    try {
        const { sold_by, total_amount, payment_method, transaction_reference } = req.body;

        const { id } = req.params;

        const [existing] = await db.query('SELECT * FROM pharmacysale WHERE id = ?', [id]);

        if (existing.length === 0) {
            return res.status(404).json({
                message: 'Pharmacy sale not found'
            });
        } 

        await db.query(
            'UPDATE pharmacysale SET sold_by = ?, total_amount = ?, payment_method = ?, transaction_reference = ? WHERE id = ?',
            [sold_by, total_amount, payment_method, transaction_reference, id]
        );

        res.json({
            message: 'updated successful'
        })
            
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error fetching pharmacy sale',
            error: error.message
        });
    }
}

//DELETE pharmacy sale by ID
exports.deletePharmacySaleByID = async (req, res) => {
    try {
        const { id } = req.params;

        const [checkExisting] = await db.query('SELECT * FROM pharmacysale WHERE id = ?', [id]);

        if (checkExisting.length === 0) {
            return res.status(404).json({
                message: 'Pharmacy sale not found'
            });
        } 

        await db.query(
            'DELETE FROM pharmacysale  WHERE id = ?',
            [id]
        );

        res.json({
            message: 'Pharmacy sale deleted successfully'
        })
            
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error deleting pharmacy sale',
            error: error.message
        });
    }
}