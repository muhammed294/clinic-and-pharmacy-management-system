const db = require('../config/db');

//POST create new medicine
exports.createMedicine = async (req, res) => {
    try {
        const { name, category, unit, unit_price, minimum_stock, is_active } = req.body;

        if (!name || !unit || !unit_price) {
            return res.status(400).json({
                message: 'name, unit, and unit_price are required!'
            })
        }

        const [result] = await db.query(
            'INSERT INTO medicine (name, category, unit, unit_price, minimum_stock, is_active) VALUE (?,?,?,?,?,?)',
            [name, category || null, unit, unit_price, minimum_stock || 5, is_active !== undefined ? is_active : true]
        );

        res.status(201).json({
            id: result.insertId,
            message: 'Medicine created successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error creating medicine', 
            error: error.message
        });
    };
}

//GET all medicines
exports.getAllMedicines = async (req, res) => {
    try {
        const [medicines] = await db.query('SELECT * FROM medicine');
        res.json(medicines);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching medicines', 
            error: error.message
        });
    };
}

//GET medicine by ID
exports.getMedicineByID = async (req, res) => {
    try {
        const { id } = req.params;

        const [medicine] = await db.query('SELECT * FROM medicine WHERE id = ?', [id]);

        if (medicine.length === 0) {
            return res.status(404).json({
                message: 'Medicine not found'
            });
        }
        
        res.json(medicine[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error fetching medicine',
            error: error.message
        });
    }
}

//PUT Medicine by ID
exports.getMedicineByID = async (req, res) => {
    try {
        const { name, category, unit, unit_price, minimum_stock, is_active } = req.body;

        const { id } = req.params;

        const [medicine] = await db.query('SELECT * FROM medicine WHERE id = ?', [id]);

        if (medicine.length === 0) {
            return res.status(404).json({
                message: 'Medicine not found'
            });
        } 

        if (medicine.length > 0) {
            medicine = await db.query('UPDATE * FROM medicine WHERE id = ?', [id]);
            return res.json({
                message: 'updated successful'
            })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error fetching medicine',
            error: error.message
        });
    }
}