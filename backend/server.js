
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');


const app = express();
const PORT = 5000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'mediconnect'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});


// Feedback API
app.post('/feedback', (req, res) => {
  const { name, email, message } = req.body;

  const sql = 'INSERT INTO feedback (name, email, message) VALUES (?, ?, ?)';
  db.query(sql, [name, email, message], (err, result) => {
    if (err) {
      console.error('Error saving feedback:', err);
      res.status(500).json({ message: 'Error saving feedback' });
    } else {
      console.log('Feedback saved successfully');
      res.status(200).json({ message: 'Feedback submitted successfully!' });
    }
  });
});


// Register
app.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const status = role === 'Doctor' ? 'pending' : 'approved';
    const sql = 'INSERT INTO users (name, email, password, role,status) VALUES (?, ?, ?, ?,?)';
    db.query(sql, [name, email, hashedPassword, role, status], (err, result) => {
      if (err) {
        console.error('Error during registration:', err);
        res.status(500).json({ message: 'Registration failed.' });
      } else {
        const msg =
          role === 'Doctor'
            ? 'Registered successfully. Awaiting admin approval.'
            : 'Registered successfully!';
        res.status(200).json({ message: msg });
      }
    });
  } catch (error) {
    console.error('Error hashing password:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

//Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], async (err, result) => {
    if (err) {
      console.error('Error during login:', err);
      res.status(500).json({ message: 'Login failed.' });
    } else {
      if (result.length > 0) {
        const user = result[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials.' });

        // CHECK DOCTOR APPROVAL
        if (user.role === "Doctor" && user.status !== "approved") {
          return res.status(401).json({ message: "Account awaiting admin approval." });
        }

        res.status(200).json({
          message: 'Login successful!',
          user: {
            role: user.role,
            id: user.id,
            status: user.status,
            email: user.email,
            name: user.name

          }


        });
      } else {
        res.status(401).json({ message: 'Invalid credentials.' });
      }
    }
  });
});



// Get dashboard stats
app.get('/admin/dashboard-stats', (req, res) => {
  const stats = {};

  const userQuery = "SELECT COUNT(*) AS totalUsers FROM users";
  const doctorQuery = "SELECT COUNT(*) AS totalDoctors FROM users WHERE role = 'Doctor'";
  const appointmentQuery = "SELECT COUNT(*) AS totalAppointments FROM appointments";
  const predictionQuery = "SELECT COUNT(*) AS totalPredictions FROM predictions";

  db.query(userQuery, (err, userResult) => {
    if (err) return res.status(500).json(err);
    stats.users = userResult[0].totalUsers;

    db.query(doctorQuery, (err, doctorResult) => {
      if (err) return res.status(500).json(err);
      stats.doctors = doctorResult[0].totalDoctors;

      db.query(appointmentQuery, (err, appointmentResult) => {
        if (err) return res.status(500).json(err);
        stats.appointments = appointmentResult[0].totalAppointments;

        db.query(predictionQuery, (err, predictionResult) => {
          if (err) return res.status(500).json(err);
          stats.predictions = predictionResult[0].totalPredictions;

          res.json(stats);
        });
      });
    });
  });
});

//Fetch appointments
app.get('/admin/monthly-appointments', (req, res) => {
  const query = `
      SELECT 
        MONTHNAME(appointment_date) AS month, 
        COUNT(*) AS count 
      FROM appointments 
      GROUP BY MONTH(appointment_date)
      ORDER BY MONTH(appointment_date);
    `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Get pending doctor approval
app.get("/api/admin/doctors/pending", (req, res) => {
  const query = "SELECT * FROM users WHERE role = 'Doctor' AND status = 'pending'"; // 'pending' in lowercase
  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching pending doctors:", err);
      return res.status(500).json({ error: "Server error" });
    }
    res.json(result);
  });
});

// Approve doctor
app.post("/api/admin/doctors/approve/:id", (req, res) => {
  const id = req.params.id;
  const query = "UPDATE users SET status = 'approved' WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Approval failed" });
    }
    res.json({ message: "Doctor approved successfully" });
  });
});

// Reject doctor
app.post("/api/admin/doctors/reject/:id", (req, res) => {
  const id = req.params.id;
  const query = "DELETE FROM users WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Rejection failed" });
    }
    res.json({ message: "Doctor rejected and removed" });
  });
});

// Get approved doctors (from users table)
app.get("/api/users/approved-doctors", (req, res) => {
  const query = "SELECT * FROM users WHERE role = ? AND status = ?";
  db.query(query, ['Doctor', 'approved'], (err, results) => {
    if (err) {
      console.error("Error fetching approved doctors:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json(results);
  });
});

// Get doctor details by user ID
app.get("/api/users/doctor-details/:id", (req, res) => {
  const userId = req.params.id;
  const query = "SELECT * FROM doctors WHERE user_id = ?";

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching doctor details:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length === 0) {
      return res.json(null); // No details yet
    }

    res.json(results[0]);
  });
});


// Add Doctor Details
app.post("/api/users/add-doctor-details", (req, res) => {
  const { user_id, name, specialization, contact, availability } = req.body;
  const query = "INSERT INTO doctors (user_id, name, specialization, contact, availability) VALUES (?, ?, ?, ?, ?)";
  db.query(query, [user_id, name, specialization, contact, availability], (err) => {
    if (err) return res.status(500).json({ message: "Insert error" });
    res.json({ message: "Details added" });
  });
});

// Update Doctor Details
app.put("/api/users/update-doctor-details/:userId", (req, res) => {
  const { name, specialization, contact, availability } = req.body;
  const { userId } = req.params;
  const query = "UPDATE doctors SET name = ?, specialization = ?, contact = ?, availability = ? WHERE user_id = ?";
  db.query(query, [name, specialization, contact, availability, userId], (err) => {
    if (err) return res.status(500).json({ message: "Update error" });
    res.json({ message: "Details updated" });
  });
});

// Delete Doctor Details
app.delete("/api/users/delete-doctor-details/:userId", (req, res) => {
  const { userId } = req.params;
  db.query("DELETE FROM doctors WHERE user_id = ?", [userId], (err) => {
    if (err) return res.status(500).json({ message: "Delete error" });
    res.json({ message: "Details deleted" });
  });
});

// Get all approved patients from users table
app.get('/api/users/approved-patients', (req, res) => {
  const query = `
    SELECT u.id, u.name, u.email, 
           d.contact, d.address, d.age, d.gender, d.medical_history,
           d.hypertension, d.heart_disease, d.smoking_history,
           d.bmi, d.HbA1c_level, d.blood_glucose_level, d.diabetes
    FROM users u
    LEFT JOIN patient_details d ON u.id = d.user_id
    WHERE u.role = 'patient' AND u.status = 'approved'
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    const patients = results.map(row => ({
      id: row.id,
      name: row.name,
      email: row.email,
      details: row.age !== null ? {
        contact: row.contact,
        address: row.address,
        age: row.age,
        gender: row.gender,
        medical_history: row.medical_history,
        hypertension: row.hypertension,
        heart_disease: row.heart_disease,
        smoking_history: row.smoking_history,
        bmi: row.bmi,
        HbA1c_level: row.HbA1c_level,
        blood_glucose_level: row.blood_glucose_level,
        diabetes: row.diabetes
      } : null
    }));
    res.json(patients);
  });
});



// Get patient details by user_id
app.get("/api/users/patient-details/:id", (req, res) => {
  const query = "SELECT * FROM patient_details WHERE user_id = ?";
  db.query(query, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ message: "Server error" });
    res.json(results[0] || null);
  });
});

// Add patient details

app.post('/api/users/add-patient-details', (req, res) => {
  const {
    user_id, contact, address, age, gender, medical_history,
    hypertension, heart_disease, smoking_history,
    bmi, HbA1c_level, blood_glucose_level, diabetes
  } = req.body;

  const query = `
    INSERT INTO patient_details (
      user_id, contact, address, age, gender, medical_history,
      hypertension, heart_disease, smoking_history,
      bmi, HbA1c_level, blood_glucose_level, diabetes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [
    user_id, contact, address, age, gender, medical_history,
    hypertension, heart_disease, smoking_history,
    bmi, HbA1c_level, blood_glucose_level, diabetes
  ], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: 'Details added' });
  });
});


// Add new patient to users table
app.post('/api/users/add-patient', (req, res) => {
  const { name, email } = req.body;
  const query = 'INSERT INTO users (name, email, role, status) VALUES (?, ?, "Patient", "approved")';
  db.query(query, [name, email], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: 'Patient added', id: result.insertId });
  });
});

// Update patient details
app.put('/api/users/update-patient-details/:id', (req, res) => {
  const { id } = req.params;
  const {
    contact, address, age, gender, medical_history,
    hypertension, heart_disease, smoking_history,
    bmi, HbA1c_level, blood_glucose_level, diabetes
  } = req.body;

  const query = `
    UPDATE patient_details SET
      contact = ?, address = ?, age = ?, gender = ?, medical_history = ?,
      hypertension = ?, heart_disease = ?, smoking_history = ?,
      bmi = ?, HbA1c_level = ?, blood_glucose_level = ?, diabetes = ?
    WHERE user_id = ?
  `;
  db.query(query, [
    contact, address, age, gender, medical_history,
    hypertension, heart_disease, smoking_history,
    bmi, HbA1c_level, blood_glucose_level, diabetes, id
  ], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Details updated' });
  });
});


// Delete patient details
app.delete('/api/users/delete-patient/:id', (req, res) => {
  const { id } = req.params;

  const deleteDetails = 'DELETE FROM patient_details WHERE user_id = ?';
  const deleteUser = 'DELETE FROM users WHERE id = ?';

  db.query(deleteDetails, [id], (err) => {
    if (err) return res.status(500).json({ error: err });

    db.query(deleteUser, [id], (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Patient deleted' });
    });
  });
});


//GET all doctors
app.get('/api/doctors', (req, res) => {
  const sql = 'SELECT * FROM users WHERE role="Doctor" AND status="approved"';
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

//GET all schedules with doctor info
app.get('/api/schedules', (req, res) => {
  const sql = `
    SELECT s.*, u.name AS doctor_name
    FROM schedule s
    JOIN users u ON s.user_id = u.id
  `;
  db.query(sql, (err, result) => {
    if (err) {
      console.error('MySQL Select Error:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(result);
  });
});


// POST a new schedule
app.post('/api/schedules', (req, res) => {
  const { user_id, date, start_time, end_time, fee, slots, room, notes } = req.body;

  if (!user_id || !date || !start_time || !end_time || !fee || !slots || !room) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const sql = `
    INSERT INTO schedule(user_id, date, start_time, end_time, fee, slots, room, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [user_id, date, start_time, end_time, fee, slots, room, notes], (err, result) => {
    if (err) {
      console.error('MySQL Insert Error:', err); // Log the actual error
      return res.status(500).json({ error: 'Failed to create schedule' });
    }
    res.status(201).json({ message: 'Schedule created successfully' });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
