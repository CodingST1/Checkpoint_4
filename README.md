# API Documentation

## Users

### GET /api/users
Returns all users.
Status Codes: 200, 500

### GET /api/users/:id
Returns a user by ID.
Status Codes: 200, 404, 500

### POST /api/users
Creates a new user.

Example Request:
{
  "name": "Pratyush Baral",
  "email": "pratyushbaral@email.com",
  "password": "123456",
  "role": "student"
}

Example Response:
{
  "message": "User created",
  "user_id": 1
}

Status Codes: 201, 400, 500

### DELETE /api/users/:id
Deletes a user.
Status Codes: 200, 404, 500

---

## Appointments

### GET /api/appointments
Returns all appointments.

### POST /api/appointments
Creates an appointment.

Example Request:
{
  "student_id": 1,
  "counselor_id": 2,
  "appointment_date": "2026-03-01",
  "appointment_time": "10:00:00",
  "status": "Scheduled"
}

Status Codes: 201, 400, 500
