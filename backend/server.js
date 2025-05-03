
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
    const status = role === 'Doctor' ? 'pending' : 'Active';
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

// Login User
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM users WHERE email = ?';
  
    db.query(sql, [email], async (err, results) => {
      if (err || results.length === 0) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      const user = results[0];
      const match = await bcrypt.compare(password, user.password);
  
      if (!match) return res.status(401).json({ message: 'Invalid email or password' });
  
      if (user.role === 'doctor' && user.status !== 'approved') {
        return res.status(403).json({ message: 'Waiting for admin approval' });
      }
  
      res.status(200).json({ message: 'Login successful', user });
    });
  });
  
  // Approve Doctor
  app.put('/admin/approve/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'UPDATE users SET status = "approved" WHERE id = ?';
    db.query(sql, [id], (err, result) => {
      if (err) return res.status(500).json({ message: 'Approval failed' });
      res.status(200).json({ message: 'Doctor approved successfully' });
    });
  });


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
