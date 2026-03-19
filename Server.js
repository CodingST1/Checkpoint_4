const express = require('express');
const cors = require('cors');

const usersRoutes = require('./routes/users');
const appointmentRoutes = require('./routes/appointments');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', usersRoutes);
app.use('/api/appointments', appointmentRoutes);

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
