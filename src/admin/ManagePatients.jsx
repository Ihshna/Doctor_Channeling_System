import React, { useEffect, useState } from "react";
import axios from "axios";

const ManagePatients = () => {
  const [patients, setPatients] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", age: "", gender: "", contact: "", address: "", medical_history: ""
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    const res = await axios.get("http://localhost:5000/api/users/approved-patients");
    const list = await Promise.all(res.data.map(async (pat) => {
      const detailRes = await axios.get(`http://localhost:5000/api/users/patient-details/${pat.id}`);
      return { ...pat, details: detailRes.data };
    }));
    setPatients(list);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isNew) {
      // Add new user + patient
      const res = await axios.post("http://localhost:5000/api/users/add-patient", formData);
      alert("New patient added!");
    } else {
      const patient = patients.find(p => p.id === selectedId);
      if (patient?.details) {
        await axios.put(`http://localhost:5000/api/users/update-patient-details/${selectedId}`, formData);
        alert("Patient details updated");
      } else {
        await axios.post("http://localhost:5000/api/users/add-patient-details", {
          user_id: selectedId, ...formData
        });
        alert("Patient details added");
      }
    }

    setSelectedId(null);
    setIsNew(false);
    setFormData({ name: "", email: "", password: "123456", age: "", gender: "", contact: "", address: "", medical_history: "" });
    fetchPatients();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete this patient's profile?")) {
      await axios.delete(`http://localhost:5000/api/users/delete-patient-details/${id}`);
      fetchPatients();
    }
  };

  const fillForm = (details, p) => {
    setFormData({ ...details, name: p.name || "", email: p.email || "", password: "" });
  };

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const startNewPatient = () => {
    setSelectedId(null);
    setIsNew(true);
    setFormData({ name: "", email: "", password: "", age: "", gender: "", contact: "", address: "", medical_history: "" });
  };

  return (
    <div className="container mt-4">
      <h3>Manage Patients</h3>
      <button className="btn btn-primary my-3" onClick={startNewPatient}>Add New Patient</button>

      {(selectedId || isNew) && (
        <div className="card p-3 mt-3">
          <h5>{isNew ? "Add New Patient" : (patients.find(p => p.id === selectedId)?.details ? "Edit" : "Add") + " Patient Details"}</h5>
          <form onSubmit={handleSubmit}>
            {isNew && (
              <>
                <input className="form-control my-2" name="name" placeholder="Full Name" value={formData.name} onChange={handleInputChange} required />
                <input className="form-control my-2" name="email" type="email" placeholder="Email" value={formData.email} onChange={handleInputChange} required />
                <input className="form-control my-2" name="password" type="text" placeholder="Default Password" value={formData.password} onChange={handleInputChange} required />
              </>
            )}
            <input className="form-control my-2" name="age" placeholder="Age" value={formData.age} onChange={handleInputChange} required />
            <input className="form-control my-2" name="gender" placeholder="Gender" value={formData.gender} onChange={handleInputChange} required />
            <input className="form-control my-2" name="contact" placeholder="Contact" value={formData.contact} onChange={handleInputChange} required />
            <input className="form-control my-2" name="address" placeholder="Address" value={formData.address} onChange={handleInputChange} required />
            <textarea className="form-control my-2" name="medical_history" placeholder="Medical History" value={formData.medical_history} onChange={handleInputChange} required />
            <button className="btn btn-success" type="submit">Save</button>
          </form>
        </div>
      )}

      <table className="table table-bordered mt-4">
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Patient Details</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(p => (
            <React.Fragment key={p.id}>
              <tr>
                <td>{p.email}</td>
                <td>{p.role}</td>
                <td>{p.status}</td>
                <td>
                  {p.details ? (
                    <>
                      <button className="btn btn-sm btn-info me-2" onClick={() => { setSelectedId(p.id); setIsNew(false); fillForm(p.details, p); }}>
                        Edit
                      </button>
                      <button className="btn btn-sm btn-danger me-2" onClick={() => handleDelete(p.id)}>
                        Delete
                      </button>
                      <button className="btn btn-sm btn-secondary" onClick={() => toggleRow(p.id)}>
                        {expandedRow === p.id ? "Hide Details" : "View Details"}
                      </button>
                    </>
                  ) : (
                    <button className="btn btn-sm btn-primary" onClick={() => { setSelectedId(p.id); setIsNew(false); }}>
                      Add Details
                    </button>
                  )}
                </td>
              </tr>
              {expandedRow === p.id && p.details && (
                <tr>
                  <td colSpan="4">
                    <strong>Name:</strong> {p.name}<br />
                    <strong>Age:</strong> {p.details.age}<br />
                    <strong>Gender:</strong> {p.details.gender}<br />
                    <strong>Contact:</strong> {p.details.contact}<br />
                    <strong>Address:</strong> {p.details.address}<br />
                    <strong>Medical History:</strong> {p.details.medical_history}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManagePatients;