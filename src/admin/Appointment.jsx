import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = () => {
    axios.get('http://localhost:5000/api/appointments')
      .then(res => {
        setAppointments(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching appointments:', err);
        setLoading(false);
      });
  };

  const handleStatusChange = (id, newStatus) => {
    axios.put(`http://localhost:5000/api/appointments/${id}`, { status: newStatus })
      .then(() => fetchAppointments())
      .catch(err => console.error('Failed to update status:', err));
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      axios.delete(`http://localhost:5000/api/appointments/${id}`)
        .then(() => fetchAppointments())
        .catch(err => console.error('Failed to delete appointment:', err));
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Manage Appointments</h2>

      {loading ? (
        <div className="text-center">Loading appointments...</div>
      ) : appointments.length === 0 ? (
        <div className="alert alert-info text-center">No appointments found.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Patient Name</th>
                <th>Doctor Name</th>
                <th>Appointment Date</th>
                <th>Status</th>
                <th>Change Status</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map(app => (
                <tr key={app.appointment_id}>
                  <td>{app.appointment_id}</td>
                  <td>{app.patient_name}</td>
                  <td>{app.doctor_name}</td>
                  <td>{new Date(app.appointment_date).toLocaleString()}</td>
                  <td>
                    <span className={`badge ${
                      app.status === 'Approved' ? 'bg-success' :
                      app.status === 'Pending' ? 'bg-warning text-dark' :
                      app.status === 'Rejected' ? 'bg-danger' :
                      'bg-secondary'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td>
                    <select
                      className="form-select"
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.appointment_id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(app.appointment_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Appointments;