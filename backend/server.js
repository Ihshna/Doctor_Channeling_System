
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
  database: 'mediconnect',
  multipleStatements:true
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

app.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    let status = 'approved';
    if (role === 'Doctor' || role === 'Admin') status = 'pending';

    const sql = 'INSERT INTO users (name, email, password, role, status) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [name, email, hashedPassword, role, status], (err, result) => {
      if (err) {
        console.error('Error during registration:', err);
        return res.status(500).json({ message: 'Registration failed.' });
      }

      let msg = 'Registered successfully!';
      if (role === 'Doctor') msg = 'Registered successfully. Awaiting admin approval.';
      if (role === 'Admin') msg = 'Registered successfully. Awaiting super admin approval.';

      res.status(200).json({ message: msg });
    });
  } catch (error) {
    console.error('Error hashing password:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

// Updated Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], async (err, result) => {
    if (err) {
      console.error('Error during login:', err);
      return res.status(500).json({ message: 'Login failed.' });
    }

    if (result.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Doctor pending approval
    if (user.role === 'Doctor' || user.role === "Admin" && user.status !== 'approved') {
      return res.status(401).json({ message: 'Account awaiting admin approval.' });
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
  });
});

// GET dashboard stats -Super admin
app.get('/superadmin/dashboard-stats', (req, res) => {
  const totalAdminsQuery = "SELECT COUNT(*) AS total FROM users WHERE role = 'Admin'";
  const approvedAdminsQuery = "SELECT COUNT(*) AS approved FROM users WHERE role = 'Admin' AND status = 'approved'";
  const pendingAdminsQuery = "SELECT COUNT(*) AS pending FROM users WHERE role = 'Admin' AND status = 'pending'";

  db.query(`${totalAdminsQuery}; ${approvedAdminsQuery}; ${pendingAdminsQuery}`, (err, results) => {
    if (err) {
      console.error("Dashboard stats error:", err);
      return res.status(500).json({ message: "Failed to fetch stats" });
    }

    res.json({
      total: results[0][0].total,
      approved: results[1][0].approved,
      pending: results[2][0].pending
    });
  });
});

//Fetch approved admins
app.get('/superadmin/approved-admins', (req, res) => {
  const sql = "SELECT id, name, email, role, status FROM users WHERE role = 'Admin' AND status = 'approved'";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching admins:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json(results);
  });
});

//Delete approved admin
app.delete('/superadmin/delete-admin/:id', (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM users WHERE id = ? AND role = 'Admin'";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting admin:", err);
      return res.status(500).json({ message: "Server error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.json({ message: "Admin deleted successfully" });
  });
});

// Add New Admin
app.post('/add-admin', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Check if the email already exists
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }

    if (result.length > 0) {
      return res.status(400).json({ message: 'Admin with this email already exists' });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = {
        name,
        email,
        password: hashedPassword,
        role: 'Admin',
        status: 'approved'
      };

      db.query('INSERT INTO users SET ?', user, (err, result) => {
        if (err) {
          return res.status(500).json({ message: 'Failed to add admin', error: err });
        }

        return res.status(200).json({ message: 'Admin added successfully' });
      });
    } catch (err) {
      return res.status(500).json({ message: 'Hashing error', error: err });
    }
  });
});

// Get all pending admins
app.get('/pending-admins', (req, res) => {
  const sql = "SELECT id, name, email, role, status FROM users WHERE role = 'Admin' AND status = 'pending'";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json(result);
  });
});

// Approve a pending admin
app.post('/approve-admin', (req, res) => {
  const { id } = req.body;
  const sql = "UPDATE users SET status = 'approved' WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error updating status' });
    res.json({ message: 'Admin approved successfully' });
  });
});

// Get dashboard stats
app.get('/admin/dashboard-stats', (req, res) => {
  const stats = {};

  const userQuery = "SELECT COUNT(*) AS totalUsers FROM users";
  const doctorQuery = "SELECT COUNT(*) AS totalDoctors FROM users WHERE role = 'Doctor'";
  const appointmentQuery = "SELECT COUNT(*) AS totalAppointments FROM appointments";
  

  db.query(userQuery, (err, userResult) => {
    if (err) return res.status(500).json(err);
    stats.users = userResult[0].totalUsers;

    db.query(doctorQuery, (err, doctorResult) => {
      if (err) return res.status(500).json(err);
      stats.doctors = doctorResult[0].totalDoctors;

      db.query(appointmentQuery, (err, appointmentResult) => {
        if (err) return res.status(500).json(err);
        stats.appointments = appointmentResult[0].totalAppointments;

          res.json(stats);
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

 //Get all appointments
 app.get('/api/appointments', (req, res) => {
  const sql = `
    SELECT 
      a.id AS appointment_id,
      p.name AS patient_name,
      d.name AS doctor_name,
      a.appointment_date,
      a.status
    FROM appointments a
    JOIN users p ON a.patient_id = p.id
    JOIN doctors d ON a.doctor_id = d.id
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching appointments:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.json(results);
  });
});

//Update appointment status

app.put('/api/appointments/:id', (req, res) => {
  const { status } = req.body;
  const id = req.params.id;
  const sql = "UPDATE appointments SET status = ? WHERE id = ?";
  db.query(sql, [status, id], (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to update status" });
    res.json({ message: "Status updated successfully" });
  });
});


//Delete Appointment
app.delete('/api/appointments/:id', (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM appointments WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to delete appointment" });
    res.json({ message: "Appointment deleted" });
  });
});

//System report
app.get('/api/system-report', (req, res) => {
  const sql = `
    SELECT 
      (SELECT COUNT(*) FROM users WHERE role = 'Patient') AS total_patients,
      (SELECT COUNT(*) FROM users WHERE role = 'Doctor') AS total_doctors,
      (SELECT COUNT(*) FROM appointments) AS total_appointments,
      (SELECT COUNT(*) FROM appointments WHERE status = 'Completed') AS completed_appointments,
      (SELECT COUNT(*) FROM appointments WHERE status = 'Pending') AS pending_appointments
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching system report:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(results[0]);
  });
});

// Doctor Dashboard Endpoint
app.get('/doctor-dashboard-summary', (req, res) => {
  const summary = {
    todaysAppointments: 0,
    upcomingAppointments: 0,
    patientQueue: 0
  };

  const today = new Date().toISOString().slice(0, 10);

  const q1 = `SELECT COUNT(*) AS count FROM appointments WHERE appointment_date = ?`;
  const q2 = `SELECT COUNT(*) AS count FROM appointments WHERE appointment_date > ?`;
  const q3 = `SELECT COUNT(*) AS count FROM appointments WHERE status = 'Pending'`;

  db.query(q1, [today], (err, result1) => {
    if (err) return res.status(500).json(err);
    summary.todaysAppointments = result1[0].count;

    db.query(q2, [today], (err, result2) => {
      if (err) return res.status(500).json(err);
      summary.upcomingAppointments = result2[0].count;

      db.query(q3, (err, result3) => {
        if (err) return res.status(500).json(err);
        summary.patientQueue = result3[0].count;

        res.json(summary);
      });
    });
  });
});

//Calendar
app.get('/appointments-calendar', (req, res) => {
  const q = `
    SELECT appointments.appointment_date, patient_details.user_id AS patientName
    FROM appointments
    JOIN patient_details ON appointments.patient_id = patient_details.patient_id
    WHERE appointments.status = 'Pending'
  `;
  
  db.query(q, (err, rows) => {
    if (err) {
      console.error('Error fetching appointments:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json(rows);
  });
});

//GET All Appointments
app.get('/appointments', (req, res) => {
  const q = `
    SELECT 
      a.id as appointment_id,
      a.appointment_date,
      a.status,
      u.name AS patientName,
      p.contact,
      p.age,
      p.medical_history
    FROM appointments a 
    JOIN users u ON a.patient_id = u.id
    JOIN patient_details p ON a.patient_id = p.user_id
    WHERE a.status = 'Pending'
    
  `;

  db.query(q, (err, results) => {
    if(err){
      console.error('Database error',err);
      return res.status(500).json({ error: 'Database error', details: err });
    }
    
    res.json(results);
  });
});


//Update Appointment Status (Confirm, Cancel, Complete)
app.put('/appointments/:id/status', (req, res) => {
  const { status } = req.body;
  const q = `UPDATE appointments SET status = ? WHERE id = ?`;

  db.query(q, [status, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Status updated successfully' });
  });
});

//Get Appointment by ID
app.get('/appointments/:id', (req, res) => {
  const id = req.params.id;
  const q = `
    SELECT 
      a.id,
      a.appointment_date,
      a.status,
      u.name AS patientName,
      p.contact,
      p.age,
      p.medical_history
    FROM appointments a
    JOIN users u ON a.patient_id = u.id
    JOIN patient_details p ON a.patient_id = p.user_id
    WHERE a.id = ?
  `;

  db.query(q, [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error', details: err });
    if (results.length === 0) return res.status(404).json({ error: 'Appointment not found' });
    res.json(results[0]);
  });
});

//Reschedule Appointment
app.put('/appointments/:id/reschedule', (req, res) => {
  const id = req.params.id;
  const { newDate } = req.body;

  const q = `
    UPDATE appointments 
    SET appointment_date = ? 
    WHERE appointment_id = ?
  `;

  db.query(q, [newDate, id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error', details: err });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Appointment not found' });
    res.json({ message: 'Appointment rescheduled successfully' });
  });
});

// GET All Patient History
app.get('/patient-history', (req, res) => {
  const q = `
    SELECT 
      u.name AS patient_name,
      pd.age,
      pd.gender,
      pd.medical_history,
      pd.hypertension,
      pd.heart_disease,
      pd.smoking_history,
      pd.bmi,
      pd.hba1c_level,
      pd.blood_glucose_level,
      pd.diabetes,
      pr.prescribed_date,
      pr.notes
    FROM prescriptions pr
    JOIN users u ON pr.patient_id = u.id
    JOIN patient_details pd ON pr.patient_id = pd.user_id
    ORDER BY pr.prescribed_date DESC
  `;

  db.query(q, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error', details: err });
    }

    res.json(results);
  });
});

// Fetch confirmed patients with details
app.get('/api/patients', (req, res) => {
  const query = `
    SELECT u.id AS patient_id, u.name, pd.age, pd.gender, pd.contact
    FROM appointments a
    JOIN users u ON a.patient_id = u.id
    JOIN patient_details pd ON u.id = pd.user_id
    WHERE a.status = 'Confirmed'
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Fetch full details for one patient including history + latest prescription
app.get('/api/patients/:id/details', (req, res) => {
  const patientId = req.params.id;
  const query = `
    SELECT 
    pd.medical_history,
    pd.hypertension,
    pd.smoking_history,
    pd.heart_disease, 
    pd.bmi,
    pd.Hba1c_level, 
    pd.blood_glucose_level,
    pd.diabetes,
           (
    SELECT notes FROM prescriptions WHERE patient_id = ? 
    ORDER BY prescribed_date DESC LIMIT 1) AS latest_prescription,
          (
    SELECT prescribed_date FROM prescriptions WHERE patient_id = ? 
    ORDER BY prescribed_date DESC LIMIT 1) AS latest_date
    FROM patient_details pd
    WHERE pd.user_id = ?
  `;
  db.query(query, [patientId, patientId, patientId], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result[0]);
  });
});

// Add a new prescription
app.post('/api/prescriptions/add', (req, res) => {
  const { patient_id, notes } = req.body;
  const query = `
    INSERT INTO prescriptions (patient_id, prescribed_date,notes)
    VALUES (?, NOW(),?)
  `;
  db.query(query, [patient_id, notes], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Prescription added successfully' });
  });
});

// Update latest prescription
app.post('/api/prescriptions/update', (req, res) => {
  const { patient_id, notes } = req.body;
  const query = `
    UPDATE prescriptions
    SET notes = ?
    WHERE patient_id = ?
    ORDER BY prescribed_date DESC
    LIMIT 1
  `;
  db.query(query, [notes, patient_id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Prescription updated successfully' });
  });
});

// Delete latest prescription
app.post('/api/prescriptions/delete', (req, res) => {
  const { patient_id } = req.body;
  const getLatestQuery = `
    SELECT id FROM prescriptions WHERE patient_id = ? ORDER BY prescribed_date DESC LIMIT 1
  `;
  db.query(getLatestQuery, [patient_id], (err, result) => {
    if (err || result.length === 0) return res.status(500).json({ error: 'No prescription found' });
    const deleteQuery = `DELETE FROM prescriptions WHERE id = ?`;
    db.query(deleteQuery, [result[0].id], (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Prescription deleted successfully' });
    });
  });
});

//Fetch confirmed patients for recommendation list
app.get('/api/patients/confirmed', (req, res) => {
  const sql = `
    SELECT u.id AS patient_id, u.name, d.age, d.gender, d.contact
    FROM appointments a
    JOIN users u ON a.patient_id = u.id
    JOIN patient_details d ON u.id = d.patient_id
    WHERE a.status = 'Confirmed'
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
});

//Add a new medical recommendation
app.post('/api/recommendations', (req, res) => {
  const {
    patient_id,
    recommendation_text,
    recommendation_type,
    date_time,
    video_link,
    location,
    meeting_purpose
  } = req.body;

  const sql = `
    INSERT INTO medical_recommendations 
    (patient_id, recommendation_text, recommendation_type, date_time, video_link, location, meeting_purpose) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [patient_id, recommendation_text, recommendation_type, date_time, video_link, location, meeting_purpose], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Recommendation added successfully' });
  });
});

//Get all recommendations with patient details
app.get('/api/recommendations', (req, res) => {
  const sql = `
    SELECT r.*, u.name, d.age, d.gender, d.contact
    FROM medical_recommendations r
    JOIN users u ON r.patient_id = u.id
    JOIN patient_details d ON u.id = d.patient_id
    ORDER BY r.created_at DESC
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
