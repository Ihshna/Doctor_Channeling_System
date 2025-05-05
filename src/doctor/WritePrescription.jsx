import React, { useEffect, useState } from 'react';
import axios from 'axios';

const WritePrescription = () => {
  const [patients, setPatients] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [details, setDetails] = useState({});
  const [newPrescription, setNewPrescription] = useState('');

  // Fetch all confirmed patients
  useEffect(() => {
    axios.get('http://localhost:5000/api/patients')
      .then(res => setPatients(res.data))
      .catch(err => console.error(err));
  }, []);

  // Expand patient details
  const handleExpand = (patientId) => {
    if (expanded === patientId) {
      setExpanded(null);
    } else {
      axios.get(`http://localhost:5000/api/patients/${patientId}/details`)
        .then(res => {
          setDetails(prev => ({ ...prev, [patientId]: res.data }));
          setExpanded(patientId);
        })
        .catch(err => console.error(err));
    }
  };

  // Add prescription
  const handleAdd = (patientId) => {
    axios.post('http://localhost:5000/api/prescriptions/add', {
      patient_id: patientId,
      notes: newPrescription
    }).then(() => {
      alert("Prescription added");
      setNewPrescription('');
      handleExpand(patientId);
    });
  };

  // Update prescription
  const handleUpdate = (patientId) => {
    axios.post('http://localhost:5000/api/prescriptions/update', {
      patient_id: patientId,
      notes: newPrescription
    }).then(() => {
      alert("Prescription updated");
      setNewPrescription('');
      handleExpand(patientId);
    });
  };

  // Delete latest prescription
  const handleDelete = (patientId) => {
    if (window.confirm("Delete latest prescription?")) {
      axios.post('http://localhost:5000/api/prescriptions/delete', {
        patient_id: patientId
      }).then(() => {
        alert("Prescription deleted");
        handleExpand(patientId);
      });
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Patients - Prescriptions & Medical History</h2>
      {patients.map((patient) => (
        <div key={patient.patient_id} className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">{patient.name}</h5>
            <p className="card-text">Age: {patient.age} | Gender: {patient.gender} | Contact: {patient.contact}</p>
            <button
              className="btn btn-primary"
              onClick={() => handleExpand(patient.patient_id)}
            >
              {expanded === patient.patient_id ? 'Hide' : 'Prescriptions'}
            </button>
            {expanded === patient.patient_id && details[patient.patient_id] && (
              <div className="mt-3 p-3 border rounded bg-light">
                <h6>Medical Details:</h6>
                <p><strong>History:</strong> {details[patient.patient_id].medical_history}</p>
                <p><strong>Hypertension:</strong> {details[patient.patient_id].hypertension}</p>
                <p><strong>Diabetes:</strong> {details[patient.patient_id].diabetes}</p>
                <p><strong>Heart Disease:</strong> {details[patient.patient_id].heart_disease}</p>
                <p><strong>Smoking History:</strong> {details[patient.patient_id].smoking_history}</p>
                <p><strong>BMI:</strong> {details[patient.patient_id].bmi}</p>
                <p><strong>HbA1c Level:</strong> {details[patient.patient_id].hba1c_level}</p>
                <p><strong>Blood Glucose:</strong> {details[patient.patient_id].blood_glucose_level}</p>

                <div className="mt-3 p-3 border bg-white rounded">
                  <h5 className="text-danger">Latest Prescription:</h5>
                  <p><strong>Date:</strong> {details[patient.patient_id].latest_date || 'N/A'}</p>
                  <p><strong>Notes:</strong> {details[patient.patient_id].latest_prescription || 'No prescription yet'}</p>
                </div>

                <div className="mt-3">
                  <textarea
                    className="form-control mb-2"
                    rows="3"
                    placeholder="Enter prescription notes..."
                    value={newPrescription}
                    onChange={(e) => setNewPrescription(e.target.value)}
                  />
                  <button className="btn btn-success me-2" onClick={() => handleAdd(patient.patient_id)}>Add</button>
                  <button className="btn btn-warning me-2" onClick={() => handleUpdate(patient.patient_id)}>Update</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(patient.patient_id)}>Delete</button>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default WritePrescription;