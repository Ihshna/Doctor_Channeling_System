import React, { useEffect, useState } from "react";
import axios from "axios";

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "", specialization: "", contact: "", availability: ""
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    const res = await axios.get("http://localhost:5000/api/users/approved-doctors");
    const enriched = await Promise.all(
      res.data.map(async (doc) => {
        const details = await axios.get(`http://localhost:5000/api/users/doctor-details/${doc.id}`);
        return { ...doc, details: details.data, hasDetails: details.data !== null };
      })
    );
    setDoctors(enriched);
  };

  const handleInputChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleAdd = (id) => {
    setSelected(id);
    setEditing(false);
    setFormData({ name: "", specialization: "", contact: "", availability: "" });
  };

  const handleEdit = (id) => {
    const doc = doctors.find((d) => d.id === id);
    if (doc.details) {
      setFormData(doc.details);
      setSelected(id);
      setEditing(true);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete?")) {
      await axios.delete(`http://localhost:5000/api/users/delete-doctor-details/${id}`);
      fetchDoctors();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await axios.put(`http://localhost:5000/api/users/update-doctor-details/${selected}`, formData);
      alert("Updated successfully");
    } else {
      await axios.post("http://localhost:5000/api/users/add-doctor-details", { user_id: selected, ...formData });
      alert("Added successfully");
    }
    setSelected(null);
    fetchDoctors();
  };

  return (
    <div className="container mt-4">
      <h3>Manage Doctors</h3>
      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Doctor Details</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doc) => (
            <tr key={doc.id}>
              <td>{doc.email}</td>
              <td>{doc.role}</td>
              <td>{doc.status}</td>
              <td>
                {doc.hasDetails ? (
                  <>
                    <span className="text-success">Added</span>
                    <button className="btn btn-warning btn-sm mx-2" onClick={() => handleEdit(doc.id)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(doc.id)}>Delete</button>
                  </>
                ) : (
                  <button className="btn btn-primary btn-sm" onClick={() => handleAdd(doc.id)}>
                    Add Details
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selected && (
        <div className="card mt-4 p-3">
          <h5>{editing ? "Edit Doctor Details" : "Add Doctor Details"}</h5>
          <form onSubmit={handleSubmit}>
            <input className="form-control my-2" name="name" value={formData.name} placeholder="Full Name" onChange={handleInputChange} required />
            <input className="form-control my-2" name="specialization" value={formData.specialization} placeholder="Specialization" onChange={handleInputChange} required />
            <input className="form-control my-2" name="contact" value={formData.contact} placeholder="Contact" onChange={handleInputChange} required />
            <input className="form-control my-2" name="availability" value={formData.availability} placeholder="Availability (e.g. Mon-Fri 9AM-5PM)" onChange={handleInputChange} required />
            <button className="btn btn-success mt-2" type="submit">
              {editing ? "Update" : "Submit"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ManageDoctors;
