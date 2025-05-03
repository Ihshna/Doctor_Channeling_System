import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';


function LandingPage() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const [feedbackData, setFeedbackData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const handleChange = (e) => {
    setFeedbackData({
      ...feedbackData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:5000/feedback', feedbackData);
      alert(response.data.message);
      setFeedbackData({ name: '', email: '', message: '' }); // clear form
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback.');
    }
  };
  

  return (
    <div style={{ backgroundColor: '#0d1b2a', color: '#ffffff', minHeight: '100vh' }}>
      
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-transparent fixed-top">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">MediConnect</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" href="#features">Features</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#feedback">Feedback</a>
              </li>
              <li className="nav-item">
                <Link to="/login" className="btn btn-primary ms-3">Login</Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="btn btn-success ms-2">Register</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="d-flex align-items-center"
        style={{
          height: '100vh',
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(cover.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          paddingTop: '80px'
        }}
      >
        <div className="container text-center" data-aos="fade-up">
          <h1 className="display-4 fw-bold mb-3">Your Health, Our Priority</h1>
          <p className="lead mb-4">Predict your health and connect with trusted doctors in seconds!</p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/login" className="btn btn-primary btn-lg">Get Started</Link>
            <Link to="/register" className="btn btn-success btn-lg">Join Us</Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-5" style={{ backgroundColor: '#1b263b' }}>
        <div className="container">
          <div className="text-center mb-5" data-aos="fade-up">
            <h2 className="fw-bold">Our Features</h2>
            <p className="text-muted">What makes MediConnect special?</p>
          </div>
          <div className="row text-center">
            <div className="col-md-4 mb-4" data-aos="fade-right">
              <div className="card h-100 shadow-sm bg-dark text-light border-0 hover-shadow">
                <div className="card-body">
                  <i className="bi bi-graph-up-arrow fs-1 mb-3"></i>
                  <h5 className="card-title">Predictive Health Alerts</h5>
                  <p className="card-text">Track your blood sugar and receive instant health predictions.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4" data-aos="fade-up">
              <div className="card h-100 shadow-sm bg-dark text-light border-0 hover-shadow">
                <div className="card-body">
                  <i className="bi bi-calendar2-check fs-1 mb-3"></i>
                  <h5 className="card-title">Doctor Channeling</h5>
                  <p className="card-text">Book appointments with specialist doctors easily online.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4" data-aos="fade-left">
              <div className="card h-100 shadow-sm bg-dark text-light border-0 hover-shadow">
                <div className="card-body">
                  <i className="bi bi-camera-video fs-1 mb-3"></i>
                  <h5 className="card-title">Video Consultations</h5>
                  <p className="card-text">Consult with doctors through secured video meetings anytime.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Feedback Section */}
      <section id="feedback" className="py-5">
        <div className="container">
          <div className="text-center mb-5" data-aos="fade-up">
            <h2 className="fw-bold">Feedback</h2>
            <p className="text-muted">We'd love to hear from you!</p>
          </div>
          <form className="mx-auto" style={{ maxWidth: '600px' }} onSubmit={handleSubmit} data-aos="fade-up">
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input type="text" className="form-control" id="name" name="name" value={feedbackData.name} onChange={handleChange} placeholder="Enter your name" />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email address</label>
              <input type="email" className="form-control" id="email" name="email" value={feedbackData.email} onChange={handleChange} placeholder="Enter your email" />
            </div>
            <div className="mb-3">
              <label htmlFor="message" className="form-label">Feedback</label>
              <textarea className="form-control" id="message" name="message" value={feedbackData.message} onChange={handleChange} rows="4" placeholder="Write your feedback"></textarea>
            </div>
            <button type="submit" className="btn btn-primary w-100">Submit Feedback</button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-4">
        <div className="container text-center">
          <div className="mb-3">
            <a href="#" className="text-white me-3 fs-4"><i className="bi bi-facebook"></i></a>
            <a href="#" className="text-white me-3 fs-4"><i className="bi bi-instagram"></i></a>
            <a href="#" className="text-white fs-4"><i className="bi bi-linkedin"></i></a>
          </div>
          <p className="mb-0">&copy; 2025 MediConnect. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}

export default LandingPage;
