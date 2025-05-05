import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginPage() {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const { email, password } = loginData;

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/login', loginData);

      if (response.status === 200) {
        const user = response.data.user;

        // Doctor with pending status
        if (
          (user.role === 'Doctor' && user.status !== 'approved') ||
          (user.role === 'Admin' && user.status !== 'approved')
        ) {
          setError(`Your account is awaiting ${user.role === 'Admin' ? 'super admin' : 'admin'} approval.`);
          return;
        }

        // Login success
        setSuccess('Login Successful!');
        localStorage.setItem("userRole", user.role);
        localStorage.setItem("userId", user.id);

        setTimeout(() => {
          if (user.role === 'Patient') {
            navigate('/patient-dashboard');
          } else if (user.role === 'Doctor') {
            navigate('/doctor-dashboard');
          } else if (user.role === 'Admin') {
            navigate('/admin-dashboard');
          } else if (user.role === 'Super Admin') {
            navigate('/superadmin-dashboard');
          }else {
            navigate('/');
          }
        }, 1500);
      }
    } catch (error) {
        console.error('Login Error:', error);
      
        if (
          error.response &&
          error.response.status === 401 &&
          error.response.data?.message === 'Account awaiting admin approval.'
        ) {
          setError('Your account is awaiting admin approval.');
        } else {
          setError('Invalid Email or Password.');
        }
      }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1b263b',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    }}>
      <div className="card p-4 shadow" style={{ width: '100%', maxWidth: '400px', backgroundColor: '#f8f8ff', color: 'black' }}>
        <h2 className="text-center mb-4">Login</h2>

        {error && <div className="alert alert-danger py-2">{error}</div>}
        {success && <div className="alert alert-success py-2">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={loginData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={loginData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 mt-2">Login</button>
        </form>

        <div className="text-center mt-3">
          <p>Don't have an account? <Link to="/register" className="text-success">Register</Link></p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;