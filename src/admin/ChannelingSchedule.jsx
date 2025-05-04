import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChannelingSchedule = () => {
  const [doctors, setDoctors] = useState([]);
  const [schedule, setSchedules] = useState([]);
  const [formData, setFormData] = useState({
    user_id: '',
    date: '',
    start_time: '',
    end_time: '',
    fee: '',
    slots: '',
    room: '',
    notes: ''
  });

  useEffect(() => {
    // Fetch doctors list
    axios.get('http://localhost:5000/api/doctors').then(res => setDoctors(res.data));

    // Fetch existing schedules
    axios.get(`http://localhost:5000/api/schedules`).then(res => setSchedules(res.data));
  }, []);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
  e.preventDefault();
  
  axios.post('http://localhost:5000/api/schedules', formData)
    .then((res) => {
      alert('Schedule added');
      setFormData({
        userr_id: '',
        date: '',
        start_time: '',
        end_time: '',
        fee: '',
        slots: '',
        room: '',
        notes: ''
      });

      // Refresh the schedules list
      axios.get('http://localhost:5000/api/schedules')
        .then((res) => setSchedules(res.data))
        .catch((err) => console.error('Error fetching schedules:', err));
    })
    .catch((err) => {
      console.error('Schedule creation failed:', err.response?.data || err.message);
      alert('Failed to add schedule. Check console for details.');
    });
};


  return (
    <div className="container mt-4">
      <h3>Channeling Schedule</h3>

      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <label>Doctor</label>
          <select name="user_id" value={formData.doctor_id} onChange={handleChange} className="form-select">
            <option value="">Select Doctor</option>
            {doctors.map(doc => (
              <option key={doc.id} value={doc.id}>{doc.name} - {doc.specialization}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <label>Date</label>
          <input type="date" name="date" className="form-control" value={formData.date} onChange={handleChange} />
        </div>
        <div className="col-md-3">
          <label>Start Time</label>
          <input type="time" name="start_time" className="form-control" value={formData.start_time} onChange={handleChange} />
        </div>
        <div className="col-md-3">
          <label>End Time</label>
          <input type="time" name="end_time" className="form-control" value={formData.end_time} onChange={handleChange} />
        </div>
        <div className="col-md-3">
          <label>Fee</label>
          <input type="number" name="fee" className="form-control" value={formData.fee} onChange={handleChange} />
        </div>
        <div className="col-md-3">
          <label>Slots</label>
          <input type="number" name="slots" className="form-control" value={formData.slots} onChange={handleChange} />
        </div>
        <div className="col-md-3">
          <label>Room</label>
          <input type="text" name="room" className="form-control" value={formData.room} onChange={handleChange} />
        </div>
        <div className="col-md-12">
          <label>Notes</label>
          <textarea name="notes" className="form-control" value={formData.notes} onChange={handleChange} />
        </div>
        <div className="col-12">
          <button className="btn btn-primary" type="submit">Add Schedule</button>
        </div>
      </form>

      <hr />

      <h5>All Scheduled Channelings</h5>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Doctor</th>
            <th>Date</th>
            <th>Time</th>
            <th>Fee</th>
            <th>Slots</th>
            <th>Room</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((s, i) => (
            <tr key={i}>
              <td>{s.doctor_name}</td>
              <td>{s.date}</td>
              <td>{s.start_time} - {s.end_time}</td>
              <td>{s.fee}</td>
              <td>{s.slots}</td>
              <td>{s.room}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ChannelingSchedule;