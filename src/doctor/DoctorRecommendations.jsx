import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, Button, Modal, Form, Container, Row, Col,
} from 'react-bootstrap';

const DoctorRecommendations = () => {
  const [patients, setPatients] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [formData, setFormData] = useState({
    recommendation_text: '',
    recommendation_type: 'physical',
    date_time: '',
    video_link: '',
    location: '',
    meeting_purpose: '',
  });

  useEffect(() => {
    fetchPatients();
    fetchRecommendations();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/patients/confirmed');
      setPatients(res.data);
    } catch (err) {
      console.error('Error fetching patients:', err);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/recommendations');
      setRecommendations(res.data);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
    }
  };

  const handleShowModal = (patient) => {
    setSelectedPatient(patient);
    setFormData({
      recommendation_text: '',
      recommendation_type: 'physical',
      date_time: '',
      video_link: '',
      location: '',
      meeting_purpose: '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      patient_id: selectedPatient.patient_id,
    };

    try {
      await axios.post('http://localhost:5000/api/recommendations', payload);
      setShowModal(false);
      fetchRecommendations();
    } catch (err) {
      console.error('Error adding recommendation:', err);
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Doctor Medical Recommendations</h2>
      <h4>Confirmed Patients</h4>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Patient</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Contact</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p, index) => (
            <tr key={p.patient_id}>
              <td>{index + 1}</td>
              <td>{p.name}</td>
              <td>{p.age}</td>
              <td>{p.gender}</td>
              <td>{p.contact}</td>
              <td>
                <Button size="sm" variant="primary" onClick={() => handleShowModal(p)}>
                  Add Recommendation
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <hr />
      <h4>Previous Recommendations</h4>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Patient</th>
            
            <th>Details</th>
            <th>Date & Time</th>
            <th>Purpose</th>
          </tr>
        </thead>
        <tbody>
          {recommendations.map((r, i) => (
            <tr key={r.id}>
              <td>{i + 1}</td>
              <td>{r.name} ({r.age}/{r.gender})</td>
              <td>
                {r.recommendation_text}<br />
                {r.video_link && <span><b>Zoom:</b> <a href={r.video_link} target="_blank" rel="noreferrer">{r.video_link}</a></span>}
                {r.location && <span><b>Location:</b> {r.location}</span>}
              </td>
              <td>{r.date_time}</td>
              <td>{r.meeting_purpose}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Give Recommendation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-2">
              <Form.Label>Recommendation</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                required
                value={formData.recommendation_text}
                onChange={(e) => setFormData({ ...formData, recommendation_text: e.target.value })}
              />
            </Form.Group>

            <Row>
              <Col>
                <Form.Group className="mb-2">
                  <Form.Label>Type</Form.Label>
                  <Form.Select
                    value={formData.recommendation_type}
                    onChange={(e) => setFormData({ ...formData, recommendation_type: e.target.value })}
                  >
                    <option value="physical">Physical</option>
                    <option value="video">Video Conference</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-2">
                  <Form.Label>Date & Time</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    required
                    value={formData.date_time}
                    onChange={(e) => setFormData({ ...formData, date_time: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>

            {formData.recommendation_type === 'video' && (
              <Form.Group className="mb-2">
                <Form.Label>Zoom/Meet Link</Form.Label>
                <Form.Control
                  type="url"
                  placeholder="Enter meeting link"
                  value={formData.video_link}
                  onChange={(e) => setFormData({ ...formData, video_link: e.target.value })}
                />
              </Form.Group>
            )}

            {formData.recommendation_type === 'physical' && (
              <Form.Group className="mb-2">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter visit location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Meeting Purpose</Form.Label>
              <Form.Control
                type="text"
                placeholder="Optional"
                value={formData.meeting_purpose}
                onChange={(e) => setFormData({ ...formData, meeting_purpose: e.target.value })}
              />
            </Form.Group>

            <div className="text-end">
              <Button type="submit" variant="success">Submit</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default DoctorRecommendations;