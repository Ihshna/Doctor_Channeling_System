import React, { useEffect, useState } from "react";
import axios from "axios";

const PendingDoctors = () => {
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const[message, setMessage]=useState('');

  useEffect(() => {
    fetchPendingDoctors();
  }, []);

  const fetchPendingDoctors = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/doctors/pending");
      setPendingDoctors(res.data); 
    } catch (err) {
      console.error("Error fetching doctors:", err);
    }
  };

  const approveDoctor = async (id) => {
    try {
    await axios.post(`http://localhost:5000/api/admin/doctors/approve/${id}`);
      setMessage('Doctor approved successfully');
      fetchPendingDoctors(); 
    } catch (err) {
      console.error("Error approving doctor:", err);
    }
  };

  const rejectDoctor = async (id) => {
    try {
        await axios.post(`http://localhost:5000/api/admin/doctors/reject/${id}`);
        setMessage('Doctor rejected successfully!');
      fetchPendingDoctors(); 
    } catch (err) {
      console.error("Error rejecting doctor:", err);
    }
  };

  return (
    <div className="container mt-4">
      <h4 className="text-primary mb-3">Pending Doctor Approvals</h4>
      {message && <div className="alert alert-info">{message}</div>}
      {pendingDoctors.length === 0 ? (
        <p>No pending doctors found.</p>
      ) : (
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Specialization</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingDoctors.map((doc) => (
              <tr key={doc.id}>
                <td>{doc.name}</td>
                <td>{doc.email}</td>
                <td>{doc.specialization || "N/A"}</td>
                <td>
                  <button className="btn btn-success btn-sm me-2" onClick={() => approveDoctor(doc.id)}>
                    Approve
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => rejectDoctor(doc.id)}>
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PendingDoctors;
