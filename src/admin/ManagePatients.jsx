import React, { useEffect, useState } from "react";
import axios from "axios";

function ManagePatients() {
  const [patients, setPatients] = useState([]);
  const [viewDetailsRow, setViewDetailsRow] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    address: "",
    age: "",
    gender: "",
    medical_history: "",
    hypertension: "",
    heart_disease: "",
    smoking_history: "",
    bmi: "",
    HbA1c_level: "",
    blood_glucose_level: "",
    diabetes: ""
  });

  const [isNew, setIsNew] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/approved-patients");
      setPatients(res.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddNewClick = () => {
    setIsNew(true);
    setSelectedId(null);
    setExpandedRow(null);
    setFormData({
      name: "",
      email: "",
      contact: "",
      address: "",
      age: "",
      gender: "",
      medical_history: "",
      hypertension: "",
      heart_disease: "",
      smoking_history: "",
      bmi: "",
      HbA1c_level: "",
      blood_glucose_level: "",
      diabetes: ""
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isNew) {
        await axios.post("http://localhost:5000/api/users/add-patient", {
          name: formData.name,
          email: formData.email,
        });
        alert("New patient added!");
      } else {
        const patient = patients.find((p) => p.id === selectedId);
        if (patient?.details) {
          await axios.put(
            `http://localhost:5000/api/users/update-patient-details/${selectedId}`,
            formData
          );
          alert("Patient details updated!");
        } else {
          await axios.post("http://localhost:5000/api/users/add-patient-details", {
            user_id: selectedId,
            ...formData,
          });
          alert("Patient details added!");
        }
      }

      fetchPatients();
      setIsNew(false);
      setSelectedId(null);
      setExpandedRow(null);
      setFormData({
        name: "",
        email: "",
        contact: "",
        address: "",
        age: "",
        gender: "",
        medical_history: "",
        hypertension: "",
        heart_disease: "",
        smoking_history: "",
        bmi: "",
        HbA1c_level: "",
        blood_glucose_level: "",
        diabetes: ""
      });
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Something went wrong. Try again.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this patient?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/users/delete-patient/${id}`);
      fetchPatients();
    } catch (error) {
      console.error("Error deleting patient:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Manage Patients</h2>
      <button className="btn btn-primary mb-3" onClick={handleAddNewClick}>
        Add New Patient
      </button>

      {isNew && (
        <div className="card p-3 mb-4">
          <h5>Add New Patient (Basic Info)</h5>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              className="form-control my-2"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="form-control my-2"
              required
            />
            <button type="submit" className="btn btn-success">
              Add Patient
            </button>
          </form>
        </div>
      )}

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <React.Fragment key={p.id}>
              <tr>
                <td>{p.name}</td>
                <td>{p.email}</td>
                <td>
                  <button
                    className="btn btn-secondary btn-sm me-2"
                    onClick={() =>
                      setViewDetailsRow(viewDetailsRow === p.id ? null : p.id)
                    }
                  >
                    {viewDetailsRow === p.id ? "Hide Details" : "View Details"}
                  </button>
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => {
                      setSelectedId(p.id);
                      setFormData({
                        name: p.name,
                        email: p.email,
                        ...p.details
                      });
                      setExpandedRow(p.id);
                      setIsNew(false);
                    }}
                  >
                    {p.details ? "Edit Details" : "Add Details"}
                  </button>
                  <button
                    className="btn btn-danger btn-sm ms-2"
                    onClick={() => handleDelete(p.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
              {viewDetailsRow === p.id && (
                <tr>
                  <td colSpan="3">
                    {p.details ? (
                      <div className="p-2 bg-light border rounded">
                        <p><strong>Contact:</strong> {p.details.contact}</p>
                        <p><strong>Address:</strong> {p.details.address}</p>
                        <p><strong>Age:</strong> {p.details.age}</p>
                        <p><strong>Gender:</strong> {p.details.gender}</p>
                        <p><strong>Medical History:</strong> {p.details.medical_history}</p>
                        <p><strong>Hypertension:</strong> {p.details.hypertension}</p>
                        <p><strong>Heart Disease:</strong> {p.details.heart_disease}</p>
                        <p><strong>Smoking History:</strong> {p.details.smoking_history}</p>
                        <p><strong>BMI:</strong> {p.details.bmi}</p>
                        <p><strong>HbA1c Level:</strong> {p.details.HbA1c_level}</p>
                        <p><strong>Blood Glucose Level:</strong> {p.details.blood_glucose_level}</p>
                        <p><strong>Diabetes:</strong> {p.details.diabetes}</p>
                      </div>
                    ) : (
                      <p className="text-muted">No details available.</p>
                    )}
                  </td>
                </tr>
              )}

              {expandedRow === p.id && (
                <tr>
                  <td colSpan="3">
                    <div className="card p-3">
                      <h5>{p.details ? "Edit" : "Add"} Details for {p.name}</h5>
                      <form onSubmit={handleSubmit}>
                        <input className="form-control my-1" name="contact" placeholder="Contact" value={formData.contact} onChange={handleInputChange} />
                        <input className="form-control my-1" name="address" placeholder="Address" value={formData.address} onChange={handleInputChange} />
                        <input className="form-control my-1" name="age" placeholder="Age" value={formData.age} onChange={handleInputChange} />
                        <input className="form-control my-1" name="gender" placeholder="Gender" value={formData.gender} onChange={handleInputChange} />
                        <textarea className="form-control my-1" name="medical_history" placeholder="Medical History" value={formData.medical_history} onChange={handleInputChange} />
                        <input className="form-control my-1" name="hypertension" placeholder="Hypertension" value={formData.hypertension} onChange={handleInputChange} />
                        <input className="form-control my-1" name="heart_disease" placeholder="Heart Disease" value={formData.heart_disease} onChange={handleInputChange} />
                        <input className="form-control my-1" name="smoking_history" placeholder="Smoking History" value={formData.smoking_history} onChange={handleInputChange} />
                        <input className="form-control my-1" name="bmi" placeholder="BMI" value={formData.bmi} onChange={handleInputChange} />
                        <input className="form-control my-1" name="HbA1c_level" placeholder="HbA1c Level" value={formData.HbA1c_level} onChange={handleInputChange} />
                        <input className="form-control my-1" name="blood_glucose_level" placeholder="Blood Glucose Level" value={formData.blood_glucose_level} onChange={handleInputChange} />
                        <input className="form-control my-1" name="diabetes" placeholder="Diabetes (Yes/No)" value={formData.diabetes} onChange={handleInputChange} />
                        <button type="submit" className="btn btn-success mt-2">Save Details</button>
                      </form>
                    </div>
                  </td>
                </tr>


              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManagePatients;