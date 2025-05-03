
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
    db.query(sql, [name, email, hashedPassword, role,status], (err, result) => {
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
        user:{
        role: user.role,
        id: user.id,
        status:user.status,
        email:user.email,
        name:user.name

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
  

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
