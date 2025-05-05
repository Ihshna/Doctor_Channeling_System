import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PendingAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [message, setMessage] = useState('');

  const fetchAdmins = async () => {
    try {
      const res = await axios.get('http://localhost:5000/pending-admins');
      setAdmins(res.data);
    } catch (err) {
      setMessage('Error fetching admins');
    }
  };

  const approveAdmin = async (id) => {
    const confirm = window.confirm('Are you sure you want to approve this admin?');
    if (!confirm) return;

    try {
      const res = await axios.post('http://localhost:5000/approve-admin', { id });
      setMessage(res.data.message);
      fetchAdmins(); 
    } catch (err) {
      setMessage('Failed to approve admin');
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Pending Admins</h2>
      {message && <p style={styles.message}>{message}</p>}
      <table style={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {admins.map(admin => (
            <tr key={admin.id}>
              <td>{admin.id}</td>
              <td>{admin.name}</td>
              <td>{admin.email}</td>
              <td>{admin.status}</td>
              <td>
                <button style={styles.button} onClick={() => approveAdmin(admin.id)}>Approve</button>
              </td>
            </tr>
          ))}
          {admins.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>No pending admins</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: {
    padding: '30px',
    maxWidth: '1000px',
    margin: '0 auto',
    background: '#fff',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)'
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px'
  },
  message: {
    color: '#007bff',
    marginBottom: '15px',
    fontWeight: 'bold'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  button: {
    padding: '6px 12px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  th: {
    background: '#f5f5f5'
  }
};

export default PendingAdmins;