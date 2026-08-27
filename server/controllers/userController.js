const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//POST create new user
exports.createUser = async (req, res) => {
    try {
        const { username , password , role, full_name } = req.body;

        if (!username || !password || !role || !full_name) {
            return res.status(400).json({
                message: 'username , password, role, and full_name are required!'
            })
        }

        const validRoles = ['admin', 'doctor', 'pharmacist', 'card_officer', 'lab_technician'];

        if (!validRoles.includes(role)) {
            return res.status(400).json({
                message: 'invalid role!'
            });
        }

        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

        const is_active = true;

        const [result] = await db.query(
            'INSERT INTO user (username , password_hash , role, full_name, is_active) VALUES (?,?,?,?,?)',
            [username , password_hash , role, full_name, is_active]
        );

        res.status(201).json({
            id: result.insertId,
            message: 'User created successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error creating user', 
            error: error.message
        });
    };
}

//GET all users
exports.getAllUsers = async (req, res) => {
    try {
        const [users] = await db.query('SELECT * FROM user');
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error fetching users', 
            error: error.message
        });
    };
}

//GET user by ID
exports.getUserByID = async (req, res) => {
    try {
        const { id } = req.params;

        const [user] = await db.query('SELECT * FROM user WHERE id = ?', [id]);

        if (user.length === 0) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        
        res.json(user[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error fetching user',
            error: error.message
        });
    }
}

//PUT user by ID
exports.updateUserByID = async (req, res) => {
    try {
        const { username, password, role, full_name, is_active } = req.body;

        const { id } = req.params;

        const [existing] = await db.query('SELECT * FROM user WHERE id = ?', [id]);

        if (existing.length === 0) {
            return res.status(404).json({
                message: 'User not found'
            });
        } 

        const validRoles = ['admin', 'doctor', 'pharmacist', 'card_officer', 'lab_technician'];

        if (!validRoles.includes(role)) {
            return res.status(400).json({
                message: 'invalid role!'
            });
        }

        let password_hash = existing[0].password_hash;

        if (password) {
            const saltRounds = 10;
            password_hash = await bcrypt.hash(password, saltRounds);
        }

        await db.query(
            'UPDATE user SET username = ?, password_hash = ?, role = ?, full_name = ?, is_active = ?  WHERE id = ?',
            [username, password_hash, role, full_name, is_active ?? existing[0].is_active, id]
        );

        res.json({
            message: 'updated successful'
        });
            
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error updating user',
            error: error.message
        });
    }
}

//DELETE user by ID
exports.deleteUserByID = async (req, res) => {
    try {
        const { id } = req.params;

        const [checkExisting] = await db.query('SELECT * FROM user WHERE id = ?', [id]);

        if (checkExisting.length === 0) {
            return res.status(404).json({
                message: 'User not found'
            });
        } 

        await db.query(
            'UPDATE user SET is_active = false  WHERE id = ?',
            [id]
        );

        res.json({
            message: 'User deactivated successfully'
        })
            
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error deleting user',
            error: error.message
        });
    }
}

//login checker
exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                message: 'username and password are required!'
            });
        }

        const [users] = await db.query('SELECT * FROM user WHERE username = ?', [username]);

        if (users.length === 0) {
            return res.status(401).json({
                message: 'Invalid username or password'
            });
        }

        const user = users[0];

        if (!user.is_active) {
            return res.status(401).json({
                message: 'Invalid username or password'
            });
        }

        const passwordMatches = await bcrypt.compare(password, user.password_hash);

        if (!passwordMatches) {
            return res.status(401).json({
                message: 'Invalid username or password'
            });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.status(200).json({
            token,
            id: user.id,
            username: user.username,
            role: user.role,
            full_name: user.full_name,
            message: 'Login successful'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error logging in',
            error: error.message
        });
    }
}