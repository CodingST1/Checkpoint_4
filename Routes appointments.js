const authenticate = require('../authmiddleware');
const express = require('express');
const router = express.Router();
const { sql, pool, poolConnect } = require('../db');

router.get('/', async (req, res) => {
    try {
        await poolConnect;
        const result = await pool.request().query('SELECT * FROM Appointment');
        res.status(200).json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    const { student_id, counselor_id, appointment_date, appointment_time, status } = req.body;

    if (!student_id || !counselor_id || !appointment_date || !appointment_time || !status)
        return res.status(400).json({ message: 'All fields are required' });

    try {
        await poolConnect;
        await pool.request()
            .input('student_id', sql.Int, student_id)
            .input('counselor_id', sql.Int, counselor_id)
            .input('appointment_date', sql.Date, appointment_date)
            .input('appointment_time', sql.Time, appointment_time)
            .input('status', sql.VarChar, status)
            .query(`
                INSERT INTO Appointment
                (student_id, counselor_id, appointment_date, appointment_time, status)
                VALUES
                (@student_id, @counselor_id, @appointment_date, @appointment_time, @status)
            `);

        res.status(201).json({ message: 'Appointment created' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await poolConnect;
        const result = await pool.request()
            .input('id', sql.Int, req.params.id)
            .query('DELETE FROM Appointment WHERE appointment_id = @id');

        if (result.rowsAffected[0] === 0)
            return res.status(404).json({ message: 'Appointment not found' });

        res.status(200).json({ message: 'Appointment deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
