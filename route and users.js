const express = require('express');
const router = express.Router();
const { sql, pool, poolConnect } = require('../db');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authenticate = require('../authMiddleware');

const SECRET = "supersecretkey";

// GET ALL USERS (PROTECTED + NO PASSWORD)
router.get('/', authenticate, async (req, res) => {
    try {
        await poolConnect;
        const result = await pool.request().query('SELECT user_id, name, email, role FROM [User]');
        res.status(200).json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//  GET USER BY ID (PROTECTED)
router.get('/:id', authenticate, async (req, res) => {
    try {
        await poolConnect;
        const result = await pool.request()
            .input('id', sql.Int, req.params.id)
            .query('SELECT user_id, name, email, role FROM [User] WHERE user_id = @id');

        if (result.recordset.length === 0)
            return res.status(404).json({ message: 'User not found' });

        res.status(200).json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// SIGN UP (HASH PASSWORD)
router.post('/', async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role)
        return res.status(400).json({ message: 'All fields are required' });

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        await poolConnect;
        await pool.request()
            .input('name', sql.VarChar, name)
            .input('email', sql.VarChar, email)
            .input('password', sql.VarChar, hashedPassword)
            .input('role', sql.VarChar, role)
            .query(`
                INSERT INTO [User] (name, email, password, role)
                VALUES (@name, @email, @password, @role)
            `);

        res.status(201).json({ message: 'User created' });
    } catch (err) {
        res.status(500).json({ message: 'Error creating user' });
    }
});

//  LOGIN 
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
        return res.status(400).json({ message: 'Invalid credentials' });

    try {
        await poolConnect;
        const result = await pool.request()
            .input('email', sql.VarChar, email)
            .query('SELECT * FROM [User] WHERE email = @email');

        const user = result.recordset[0];

        if (!user)
            return res.status(401).json({ message: 'Invalid credentials' });

        const match = await bcrypt.compare(password, user.password);

        if (!match)
            return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign(
            { user_id: user.user_id, email: user.email },
            SECRET,
            { expiresIn: "1h" }
        );

        res.json({ token });

    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

//  LOGOUT
router.post('/logout', (req, res) => {
    res.json({ message: 'Logout successful (delete token on client)' });
});

//  DELETE USER (PROTECTED)
router.delete('/:id', authenticate, async (req, res) => {
    try {
        await poolConnect;
        const result = await pool.request()
            .input('id', sql.Int, req.params.id)
            .query('DELETE FROM [User] WHERE user_id = @id');

        if (result.rowsAffected[0] === 0)
            return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
