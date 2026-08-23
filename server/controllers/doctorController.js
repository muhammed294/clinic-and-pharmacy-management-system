const db = require('../config/db');

//POST create new doctor
exports.createDoctor = async (req, res) => {
    try {
        const { user_id , first_name, last_name, department, phone_number, license_number } = req.body;

        if (!user_id || !first_name || !last_name || !department || !phone_number || !license_number) {
            return res.status(400).json({
                message: 'user_id, first_name, last_name, department, phone_number,  and license_number are required!'
            })
        }

        const validDepartments = ['child', 'adult', 'emergency'];

        if (!validDepartments.includes(department)) {
            return res.status(400).json({
                message: 'invalid department!'
            })
        }

        const [result] = await db.query(
            'INSERT INTO doctor (user_id , first_name, last_name, department, phone_number, license_number) VALUES (?,?,?,?,?,?)',
            [user_id , first_name, last_name, department, phone_number, license_number]
        );

        res.status(201).json({
            id: result.insertId,
            message: 'Doctor created successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error creating doctor', 
            error: error.message
        });
    };
}

//GET all doctor
exports.getAllDoctors = async (req, res) => {
    try {
        const [doctors] = await db.query('SELECT * FROM doctor');
        res.json(doctors);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error fetching doctors', 
            error: error.message
        });
    };
}

//GET doctor by ID
exports.getDoctorByID = async (req, res) => {
    try {
        const { id } = req.params;

        const [doctor] = await db.query('SELECT * FROM doctor WHERE id = ?', [id]);

        if (doctor.length === 0) {
            return res.status(404).json({
                message: 'Doctor not found'
            });
        }
        
        res.json(doctor[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error fetching doctor',
            error: error.message
        });
    }
}

//PUT doctor by ID
exports.updateDoctorByID = async (req, res) => {
    try {
        const { user_id , first_name, last_name, department, phone_number, license_number } = req.body;

        const { id } = req.params;

        const [existing] = await db.query('SELECT * FROM doctor WHERE id = ?', [id]);

        if (existing.length === 0) {
            return res.status(404).json({
                message: 'Doctor not found'
            });
        } 

        const validDepartments = ['child', 'adult', 'emergency'];

        if (!validDepartments.includes(department)) {
            return res.status(400).json({
                message: 'invalid department!'
            })
        }

        await db.query(
            'UPDATE doctor SET user_id = ?, first_name = ?, last_name = ?,department = ?, phone_number = ?, license_number = ?  WHERE id = ?',
            [user_id , first_name, last_name, department, phone_number, license_number, id]
        );

        res.json({
            message: 'updated successful'
        })
            
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error fetching doctor',
            error: error.message
        });
    }
}

//DELETE doctor by ID
exports.deleteDoctorByID = async (req, res) => {
    try {
        const { id } = req.params;

        const [checkExisting] = await db.query('SELECT * FROM doctor WHERE id = ?', [id]);

        if (checkExisting.length === 0) {
            return res.status(404).json({
                message: 'Doctor not found'
            });
        } 

        await db.query(
            'DELETE FROM doctor WHERE id = ?',
            [id]
        );

        res.json({
            message: 'doctor deleted successfully'
        })
            
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error deleting doctor',
            error: error.message
        });
    }
}