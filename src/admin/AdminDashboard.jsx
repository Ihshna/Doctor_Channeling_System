import React from 'react';
import {
  FaUserMd,
  FaUsers,
  FaCalendarCheck,
  FaChartBar,
  FaClipboardList
} from 'react-icons/fa';
import './AdminDashboard.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);


function AdminDashboard() {
  //Cards
  const [stats, setStats] = useState({
    users: 0,
    doctors: 0,
    appointments: 0,
    predictions: 0
  });

  useEffect(() => {
    axios.get('http://localhost:5000/admin/dashboard-stats')
      .then(res => setStats(res.data))
      .catch(err => console.error('Error fetching stats', err));
  }, []);

  //Appointment chart
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    axios.get('http://localhost:5000/admin/monthly-appointments')
      .then(res => {
        const labels = res.data.map(row => row.month);
        const data = res.data.map(row => row.count);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Appointments',
              data: data,
              backgroundColor: '#007bff',
              borderRadius: 6
            }
          ]
        });
      })
      .catch(err => console.error('Error loading chart data', err));
  }, []);

  return (

    <div className="container-fluid px-4 py-4 fade-in">
      <h2 className="fw-bold text-primary mb-4 slide-down">Welcome back, Admin 👋</h2>

      {/* Stat Cards */}
      <div className="row g-4">
        <div className="col-md-3">
          <div className="card dashboard-card hover-zoom">
            <div className="icon-box bg-primary">
              <FaUsers />
            </div>
            <div>
              <p>Total Users</p>
              <h4>{stats.users}</h4>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card dashboard-card hover-zoom">
            <div className="icon-box bg-success">
              <FaUserMd />
            </div>
            <div>
              <p>Total Doctors</p>
              <h4>{stats.doctors}</h4>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card dashboard-card hover-zoom">
            <div className="icon-box bg-warning">
              <FaCalendarCheck />
            </div>
            <div>
              <p>Appointments</p>
              <h4>{stats.appointments}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="row g-4 mt-4">
        <div className="col-md-6">
          <div className="card p-4 shadow-sm h-100 hover-lift">
            <div className="d-flex align-items-center mb-2">
              <FaChartBar className="me-2 text-primary" />
              <h5 className="mb-0">Monthly Appointments</h5>
            </div>
            <div className="text-muted text-center py-5">
              {chartData.labels.length === 0 ? (
                <p className="text-muted text-center">No appointment data available yet.</p>
              ) : (
                <Bar data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card p-4 shadow-sm h-100 hover-lift">
            <div className="d-flex align-items-center mb-2">
              <FaClipboardList className="me-2 text-success" />
              <h5 className="mb-0">Recent Activity</h5>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">✔️ Dr. Silva approved</li>
              <li className="list-group-item">✔️ 12 Appointments booked</li>
              <li className="list-group-item">✔️ Feedback from patient A</li>
              <li className="list-group-item">✔️ Prediction alert generated</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

  );
}

export default AdminDashboard;