import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Spinner, Alert, Container, Row, Col } from 'react-bootstrap';

const PrescriptionHistory = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const patientId = 48;
  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/prescriptions/${patientId}`);
        if (response.data.message) {
          setError(response.data.message);
        } else {
          setPrescriptions(response.data);
        }
      } catch (err) {
        setError('Failed to fetch prescription history.');
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  return (
    <Container className="mt-4">
      <h3 className="mb-4 text-primary">Prescription History</h3>

      {loading && (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      )}

      {error && (
        <Alert variant="warning" className="text-center">
          {error}
        </Alert>
      )}

      {!loading && !error && prescriptions.length > 0 && (
        <Row xs={1} md={2} lg={2} className="g-4">
          {prescriptions.map((prescription) => (
            <Col key={prescription.prescription_id}>
              <Card className="shadow-sm border-primary">
                <Card.Body>
                  <Card.Title className="text-success">
                    Dr. {prescription.doctor_name} ({prescription.specialization})
                  </Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    Appointment Date: {new Date(prescription.appointment_date).toLocaleDateString()}
                  </Card.Subtitle>
                  <hr />
                  <Card.Text>
                    <strong>Prescribed Date:</strong>{' '}
                    {new Date(prescription.prescribed_date).toLocaleDateString()}
                    <br />
                    <strong>Notes:</strong> {prescription.notes}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default PrescriptionHistory;