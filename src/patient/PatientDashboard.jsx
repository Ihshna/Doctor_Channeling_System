import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button } from "react-bootstrap";


const PatientDashboard = ({ patientId=(48) }) => {
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [lastHealthReading, setLastHealthReading] = useState(null);
  const [nextAppointment, setNextAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/patient-dashboard/${patientId}`)
      .then((res) => {
        setTotalAppointments(res.data.totalAppointments);
        setLastHealthReading(res.data.lastHealthReading);
        setNextAppointment(res.data.nextAppointment);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Dashboard fetch error:", err);
        setLoading(false);
      });
  }, [patientId]);

  if (loading) {
    return <div className="text-center p-5">Loading dashboard...</div>;
  }

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Welcome to Your Dashboard</h3>

      {/* Quick Health Summary */}
      <div className="row mb-4">
        <div className="col-md-4">
          <Card className="shadow-sm border-primary">
            <Card.Body>
              <Card.Title>Total Appointments</Card.Title>
              <h2>{totalAppointments}</h2>
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-4">
          <Card className="shadow-sm border-success">
            <Card.Body>
              <Card.Title>Last Health Reading</Card.Title>
              {lastHealthReading ? (
                <div>
                  <p><strong>Weight:</strong> {lastHealthReading.weight} kg</p>
                  <p><strong>Blood Sugar:</strong> {lastHealthReading.blood_sugar} mg/dL</p>
                  <p><strong>Blood Pressure:</strong>{lastHealthReading.blood_pressure}</p>
                  <p><strong>Date:</strong> {lastHealthReading.reading_date}</p>
                </div>
              ) : (
                <p>No records found</p>
              )}
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-4">
          <Card className="shadow-sm border-info">
            <Card.Body>
              <Card.Title>Next Appointment</Card.Title>
              {nextAppointment ? (
                <div>
                  <p><strong>Appointment ID:</strong>{nextAppointment.id}</p>
                  <p><strong>Doctor ID:</strong> {nextAppointment.doctor_id}</p>
                  <p><strong>Date:</strong> {nextAppointment.appointment_date}</p>
                  <p><strong>Status:</strong> {nextAppointment.status}</p>
                </div>
              ) : (
                <p>No upcoming appointments</p>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>
      {/* Call to Action */}
      <div className="text-center mt-5">
        <h5>Need a consultation?</h5>
        <Button variant="success" href="/patient-dashboard/doctors">
          Channel a Doctor
        </Button>
      </div>
    </div>
  );
};

export default PatientDashboard;