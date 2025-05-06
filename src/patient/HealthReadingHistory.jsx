import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Spinner, Alert } from "react-bootstrap";
import { FaNotesMedical } from "react-icons/fa";

const HealthReadingHistory = ({ patientId }) => {
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/patient/${patientId}/health-readings`)
      .then((res) => {
        setReadings(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching readings:", err);
        setError("Failed to load health readings.");
        setLoading(false);
      });
  }, [patientId]);

  return (
    <div className="container mt-5">
      <h3 className="text-center text-primary mb-4">
        <FaNotesMedical className="me-2" />
        Health Reading History
      </h3>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : error ? (
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      ) : readings.length === 0 ? (
        <Alert variant="info" className="text-center">
          No health readings found.
        </Alert>
      ) : (
        <div className="row">
          {readings.map((reading) => (
            <div className="col-md-6 col-lg-4 mb-4" key={reading.id}>
              <Card className="shadow-sm border-primary">
                <Card.Header className="bg-primary text-white">
                  Date: {new Date(reading.reading_date).toLocaleDateString()}
                </Card.Header>
                <Card.Body>
                  <p><strong>Blood Sugar:</strong> {reading.blood_sugar} mg/dL</p>
                  <p><strong>Weight:</strong> {reading.weight} kg</p>
                  <p><strong>Blood Pressure:</strong> {reading.blood_pressure}</p>
                  {reading.notes && (
                    <p className="text-muted"><strong>Notes:</strong> {reading.notes}</p>
                  )}
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HealthReadingHistory;