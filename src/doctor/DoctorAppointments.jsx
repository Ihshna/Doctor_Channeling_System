import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Card, Form } from "react-bootstrap";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [successMessage,setSuccessMessage]= useState('');
  const [showSuccess,setShowSuccess]=useState(false);
  const [consultationData, setConsultationData] = useState({
    consultation_time: "",
    location: "",
    zoom_link: "",
  });

  const fetchAppointments = () => {
    axios
      .get("http://localhost:5000/api/appointments/pending")
      .then((res) => setAppointments(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleViewSlip = (imageUrl) => {
    window.open(`http://localhost:5000/${imageUrl}`, "_blank");
  };

  const handleOpenModal = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAppointment(null);
    setConsultationData({
      consultation_time: "",
      location: "",
      zoom_link: "",
    });
  };

  const updateStatus = async (id, status) => {
    try {
      const response =
      await axios.put(`http://localhost:5000/appointments/${id}/status`, { status });
      setSuccessMessage(response.data.message);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      fetchAppointments();
    } catch (err) {
      console.error('Status update error:', err);
    }
  };

  const handleConfirmAppointment = () => {
    const { consultation_time, location, zoom_link } = consultationData;
    axios
      .put(`http://localhost:5000/api/appointments/confirm/${selectedAppointment.id}`, {
        mode:selectedAppointment.mode,
        location,
        zoom_link,
        consultation_time,
      })
      .then((res) => {
        alert("Appointment confirmed successfully!");
        handleCloseModal();
        fetchAppointments();
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to confirm appointment.");
      });
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-primary">Pending Appointments</h3>
      {appointments.map((appt) => (
        <Card key={appt.id} className="mb-3 shadow">
          <Card.Body>
            <Card.Title>{appt.patient_name}</Card.Title>
            <Card.Text>
              <strong>Appointment Date:</strong> {appt.appointment_date}<br />
              <strong>Contact:</strong> {appt.contact}<br />
              <strong>Age:</strong> {appt.age}<br />
              <strong>Medical History:</strong> {appt.medical_history}<br />
              <strong>Status:</strong> {appt.status}<br />
              <strong>Mode:</strong> {appt.mode}
            </Card.Text>
            <Button
              variant="info"
              className="me-2 bg-secondary"
              onClick={() => handleViewSlip(appt.payment_proof)}
            >
              View Slip
            </Button>
            <Button variant="success" onClick={() => handleOpenModal(appt)}>
              Confirm
            </Button>
          </Card.Body>
        </Card>
      ))}

      {/* Modal for confirming appointment */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Consultation Time</Form.Label>
              <Form.Control
                type="time"
                value={consultationData.consultation_time}
                onChange={(e) =>
                  setConsultationData({ ...consultationData, consultation_time: e.target.value })
                }
              />
            </Form.Group>
            {selectedAppointment?.mode === "physical" ? (
              <Form.Group className="mb-3">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Clinic/Hospital Address"
                  value={consultationData.location}
                  onChange={(e) =>
                    setConsultationData({ ...consultationData, location: e.target.value })
                  }
                />
              </Form.Group>
            ) : (
              <Form.Group className="mb-3">
                <Form.Label>Zoom Link</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="https://zoom.us/..."
                  value={consultationData.zoom_link}
                  onChange={(e) =>
                    setConsultationData({ ...consultationData, zoom_link: e.target.value })
                  }
                />
              </Form.Group>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmAppointment}>
            Confirm Appointment
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DoctorAppointments;