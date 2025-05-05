import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Table, Alert } from 'react-bootstrap';

const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await axios.get('http://localhost:5000/superadmin/approved-admins');
      setAdmins(res.data);
    } catch (error) {
      console.error('Error fetching admins:', error);
    }
  };

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/superadmin/delete-admin/${selectedId}`);
      setMessage('Admin deleted successfully.');
      setShowConfirm(false);
      fetchAdmins();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Approved Admins</h3>

      {message && <Alert variant="success" onClose={() => setMessage('')} dismissible>{message}</Alert>}

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          {admins.length > 0 ? (
            admins.map(admin => (
              <tr key={admin.id}>
                <td>{admin.id}</td>
                <td>{admin.name}</td>
                <td>{admin.email}</td>
                <td>{admin.role}</td>
                <td>
                  <span className="badge bg-success text-uppercase">{admin.status}</span>
                </td>
                <td>
                  <Button variant="danger" size="sm" onClick={() => handleDeleteClick(admin.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="6" className="text-center">No approved admins found.</td></tr>
          )}
        </tbody>
      </Table>

      {/* Confirm Delete Modal */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this admin?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminList;