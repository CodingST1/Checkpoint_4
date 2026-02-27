const express = require('express');
const cors = require('cors');

const usersRoutes = require('./routes and users.js/users');
const appointmentRoutes = require('./routes and users.js/appointments');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', usersRoutes);
app.use('/api/appointments', appointmentRoutes);

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
const express = require('express');
const cors = require('cors');

const usersRoutes = require('./routes and users.js/users');
const appointmentRoutes = require('./routes and users.js/appointments');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', usersRoutes);
app.use('/api/appointments', appointmentRoutes);

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
