import { useEffect, useState } from 'react';
import axios from 'axios';
import './SuperAdminDashboard.css';

function SuperAdminDashboard() {
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0 });

  useEffect(() => {
    axios.get('http://localhost:5000/superadmin/dashboard-stats')
      .then(res => setStats(res.data))
      .catch(err => console.error('Dashboard stats fetch error:', err));
  }, []);

  return (
    <div className="container py-4">
      <h2 className="mb-4">Super Admin Dashboard</h2>
      <div className="row">
        <div className="col-md-4 mb-3">
          <div className="card text-white bg-primary">
            <div className="card-body">
              <h5>Total Admins</h5>
              <p className="display-6">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card text-white bg-success">
            <div className="card-body">
              <h5>Approved Admins</h5>
              <p className="display-6">{stats.approved}</p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card text-white bg-warning">
            <div className="card-body">
              <h5>Pending Admins</h5>
              <p className="display-6">{stats.pending}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuperAdminDashboard;