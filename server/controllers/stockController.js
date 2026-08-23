const db = require('../config/db');
const { param } = require('../routes/medicineRoutes');

//POST create new stock
exports.createNewStock = async (req, res) => {
    try {
        const { medicine_id, batch_number, quantity, expiry_date, supplier_name } = req.body;
        
        if (!medicine_id || !batch_number || !quantity || !expiry_date ) {
            return res.status(400).json({
                message: 'medicine_id batch_number, quantity, and expiry_date are required!'
            });
        }

        const [result] = await db.query(
            'INSERT INTO stock (medicine_id, batch_number, quantity, expiry_date, supplier_name) VALUES (?,?,?,?,?)',
            [medicine_id, batch_number, quantity,  expiry_date, supplier_name || null]
        );

        res.status(201).json({
            id: result.insertId,
            message: 'medicine stock created successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error creating medicine stock', 
            error: error.message
        });
    }
}

//GET all stock
exports.getAllStocks = async (req, res) => {
    try {
        const [stocks] = await db.query('SELECT * FROM stock');
        res.json(stocks);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error fetching stocks', 
            error: error.message
        });
    }
}

//GET all stock by ID
exports.getAllStocksByID = async (req, res) => {
    try {
        const { id } = req.params;
        const [stock] = await db.query('SELECT * FROM stock WHERE id = ?', [id]);

        if (stock.length === 0) {
            return res.status(404).json({
                message: 'Stock not found'
            });
        }

        res.json(stock[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error fetching stocks', 
            error: error.message
        });
    }
}

//UPDATE stock by ID
exports.updateAllStocksByID = async (req, res) => {
    try {
        const { medicine_id, batch_number, quantity, expiry_date, supplier_name } = req.body;
        const { id } = req.params;
        const [existing] = await db.query('SELECT * FROM stock WHERE id = ?', [id]);

        if (existing.length === 0) {
            return res.json({
                message: 'Stock not found'
            });
        }

        await db.query(
            'UPDATE stock SET medicine_id = ?, batch_number = ?, quantity = ?, expiry_date = ?, supplier_name = ?  WHERE id = ?',
            [medicine_id, batch_number, quantity, expiry_date, supplier_name, id]
        );

        res.json({
            message: 'updated successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error updating stock', 
            error: error.message
        });
    }
}

//GET medicine minimum stock value
exports.getAllLowStocks = async (req, res) => {
    try {
        const [stock] = await db.query(
            `SELECT m.name, s.quantity, m.minimum_stock 
            FROM medicine m 
            JOIN stock s ON m.id = s.medicine_id 
            WHERE  s.quantity <= m.minimum_stock`,
        );

        if (stock.length === 0) {
            return res.status(404).json({
                message: 'Low Stocks not found'
            });
        }

        res.json(stock);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error fetching low stocks', 
            error: error.message
        });
    }
}

//DELETE stock by ID
exports.deleteAllStocksByID = async (req, res) => {
    try {
        const { id } = req.params;
        const [existing] = await db.query('SELECT * FROM stock WHERE id = ?', [id]);

        if (existing.length === 0) {
            return res.status(404).json({
                message: 'Stock not found'
            });
        }

        await db.query('DELETE FROM stock WHERE id = ?',[id]);

        res.json({
            message: 'deleted successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error deleting stock', 
            error: error.message
        });
    }
}