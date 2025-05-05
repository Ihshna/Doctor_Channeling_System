import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [successMessage,setSuccessMessage]= useState('');
  const [showSuccess,setShowSuccess]=useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/appointments');
      setAppointments(response.data);
    } catch (err) {
      setError('Failed to load appointments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const response =
      await axios.put(`http://localhost:5000/appointments/${id}/status`, { status });
      setSuccessMessage(response.data.message);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      fetchAppointments();
    } catch (err) {
      console.error('Status update error:', err);
    }
  };

  const handleReschedule = async () => {
    try {
      await axios.put(`http://localhost:5000/appointments/${selectedId}/reschedule`, { newDate });
      setShowModal(false);
      setNewDate('');
      setSelectedId(null);
      fetchAppointments();
    } catch (err) {
      console.error('Reschedule error:', err);
    }
  };

  const openRescheduleModal = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Pending Appointments</h2>
      {showSuccess &&(
        <div className="alert alert-success" role="alert">
        {successMessage}
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : appointments.length === 0 ? (
        <p>No pending appointments found.</p>
      ) : (
        <div className="row">
          {appointments.map((appt) => (
            <div className="col-md-6 mb-4" key={appt.appointment_id}>
              <div className="card shadow-sm border-primary">
                <div className="card-body">
                  <h5 className="card-title">{appt.patientName}</h5>
                  <p className="card-text mb-1"><strong>Appointment Date:</strong> {new Date(appt.appointment_date).toLocaleDateString()}</p>
                  <p className="card-text mb-1"><strong>Contact:</strong> {appt.contact}</p>
                  <p className="card-text mb-1"><strong>Age:</strong> {appt.age}</p>
                  <p className="card-text mb-1"><strong>Medical History:</strong> {appt.medical_history}</p>
                  <span className="badge bg-warning text-dark">{appt.status}</span>

                  <div className="mt-3">
                    <button className="btn btn-success btn-sm me-2" onClick={() => updateStatus(appt.appointment_id, 'Confirmed')}>Confirm</button>
                    <button className="btn btn-danger btn-sm me-2" onClick={() => updateStatus(appt.appointment_id, 'Cancelled')}>Cancel</button>
                    <button className="btn btn-info btn-sm" onClick={() => openRescheduleModal(appt.appointment_id)}>Reschedule</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reschedule Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Reschedule Appointment</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <input
                  type="date"
                  className="form-control"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                <button className="btn btn-primary" onClick={handleReschedule}>Save changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;