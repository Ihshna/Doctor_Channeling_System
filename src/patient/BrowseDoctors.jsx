import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Button,
  Row,
  Col,
  Modal,
  Form,
  Alert,
  Spinner,
} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

const BrowseDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [mode, setMode] = useState("Physical");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate= useNavigate();
  
  const patientId = 48;

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/doctors/details/48}`);
      setDoctors(res.data);
    } catch (err) {
      console.error("Error fetching doctors:", err);
    }
  };

  const handleBookNowClick = (doctor) => {
    setSelectedDoctor(doctor);
    setShowModal(true);
  };

  const handleConfirmBooking = async () => {
    if (!appointmentDate || !mode) {
      setMessage("Please select date and mode.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/appointments/booking", {
        patient_id: patientId,
        doctor_id: selectedDoctor.doctor_id,
        appointment_date: appointmentDate,
        mode: mode,
      });

      setMessage(res.data.message);
      setShowModal(false); 
      fetchDoctors();

      //Redirect to Payment
      navigate("/patient-dashboard/payment");
    } catch (err) {
      console.error("Booking error:", err);
      setMessage("Failed to book appointment.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (appointmentId) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:5000/api/appointments/cancel/${appointmentId}`);
      setMessage("Appointment cancelled successfully.");
      fetchDoctors();
    } catch (err) {
      console.error("Cancel error:", err);
      setMessage("Failed to cancel appointment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="text-primary text-center mb-4">Browse Doctors</h3>

      {message && <Alert variant="info">{message}</Alert>}

      <Row>
        {doctors.map((doc) => (
          <Col md={6} lg={4} key={doc.doctor_id} className="mb-4">
            <Card className="shadow">
              <Card.Body>
                <Card.Title>{doc.name}</Card.Title>
                <Card.Subtitle className="text-muted mb-2">
                  {doc.specialization}
                </Card.Subtitle>
                <Card.Text>
                  <strong>Email:</strong> {doc.email} <br />
                  <strong>Contact:</strong> {doc.contact} <br />
                  <strong>Availability:</strong> {doc.availability}
                </Card.Text>

                <Button
                  variant="primary"
                  className="w-100 mb-2"
                  onClick={() => handleBookNowClick(doc)}
                >
                  Book Now
                </Button>

               
                {doc.appointment_id && (
                  <Button
                    variant="danger"
                    className="w-100"
                    onClick={() => handleCancel(doc.appointment_id)}
                  >
                    Cancel Appointment
                  </Button>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Booking Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Book Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="appointmentDate" className="mb-3">
              <Form.Label>Choose Date</Form.Label>
              <Form.Control
                type="date"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="mode" className="mb-3">
              <Form.Label>Consultation Mode</Form.Label>
              <Form.Select value={mode} onChange={(e) => setMode(e.target.value)}>
                <option value="Physical">Physical Visit</option>
                <option value="Video">Video Conference</option>
              </Form.Select>
            </Form.Group>

            <Button
              variant="success"
              className="w-100"
              onClick={handleConfirmBooking}
              disabled={loading}
            >
              {loading ? <Spinner animation="border" size="sm" /> : "Confirm Booking"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default BrowseDoctors;