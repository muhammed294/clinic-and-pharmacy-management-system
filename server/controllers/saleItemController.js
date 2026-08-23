const db = require('../config/db');

//POST create new sale item
exports.createSaleItem = async (req, res) => {
    const connection = await db.getConnection();
    try {
        const { sale_id, medicine_id, quantity } = req.body;

        if (!sale_id || !medicine_id || !quantity) {
            return res.status(400).json({
                message: 'sale_id, medicine_id, and quantity are required!'
            })
        }

        await connection.beginTransaction();

        const [medicineRows] = await connection.query(
            'SELECT unit_price FROM medicine WHERE id = ?',[medicine_id]
        );

        if (medicineRows.length === 0) {
            await connection.rollback();
            return res.status(404).json({
                message: 'Madicine not found'
            });
        }

        const price_at_sale = medicineRows[0].unit_price;
        const subtotal = price_at_sale*quantity;

        const [stockRows] = await connection.query(
            'SELECT quantity FROM stock WHERE medicine_id = ?',[medicine_id]
        )

        if (stockRows.length === 0 || stockRows[0].quantity < quantity) {
            await connection.rollback();
            return res.status(400).json({
                message: 'Not enough stock available'
            });
        }

        const [result] = await connection.query(
            'INSERT INTO saleitem (sale_id, medicine_id, quantity, price_at_sale, subtotal) VALUES (?,?,?,?,?)',
            [sale_id, medicine_id, quantity, price_at_sale, subtotal]
        );

        await connection.query(
            'UPDATE stock SET quantity = quantity - ? WHERE medicine_id = ?', [quantity, medicine_id]
        );

        await connection.query(
            'UPDATE pharmacysale SET total_amount = total_amount + ? WHERE id = ?', [subtotal, sale_id]
        );

        await connection.commit();

        res.status(201).json({
            id: result.insertId,
            subtotal,
            message: 'Sale item created successfully'
        });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({
            message: 'Error creating sale item', 
            error: error.message
        });
    } finally {
        connection.release();
    }
}

//GET all sale item 
exports.getAllSaleItem = async (req, res) => {
    try {
        const [sale] = await db.query('SELECT * FROM saleitem');
        res.json(sale);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error fetching sale item',
            error: error.message
        });
    };
}

//GET sale item by ID
exports.getSaleItemByID = async (req, res) => {
    try {
        const { id } = req.params;

        const [saleitem] = await db.query('SELECT * FROM saleitem WHERE id = ?', [id]);

        if (saleitem.length === 0) {
            return res.status(404).json({
                message: 'Sale item sale not found'
            });
        }
        
        res.json(saleitem[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error fetching sale item',
            error: error.message
        });
    }
}

//PUT sale item by ID
exports.updateSaleItemByID = async (req, res) => {
    try {
        const { sale_id, medicine_id, quantity, price_at_sale, subtotal } = req.body;

        const { id } = req.params;

        const [existing] = await db.query('SELECT * FROM saleitem WHERE id = ?', [id]);

        if (existing.length === 0) {
            return res.status(404).json({
                message: 'Sale item not found'
            });
        } 

        await db.query(
            'UPDATE saleitem SET sale_id = ?, medicine_id = ?, quantity = ?, price_at_sale = ?, subtotal = ? WHERE id = ?',
            [sale_id, medicine_id, quantity, price_at_sale, subtotal, id]
        );

        res.json({
            message: 'updated successful'
        })
            
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error fetching sale item',
            error: error.message
        });
    }
}

//DELETE sale item by ID
exports.deleteSaleItemByID = async (req, res) => {
    try {
        const { id } = req.params;

        const [checkExisting] = await db.query('SELECT * FROM saleitem WHERE id = ?', [id]);

        if (checkExisting.length === 0) {
            return res.status(404).json({
                message: 'Sale item not found'
            });
        } 

        await db.query(
            'DELETE FROM saleitem  WHERE id = ?',
            [id]
        );

        res.json({
            message: 'Sale item deleted successfully'
        })
            
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error deleting sale item',
            error: error.message
        });
    }
}