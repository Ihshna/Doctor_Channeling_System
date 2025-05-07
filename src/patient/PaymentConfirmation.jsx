import React, { useState, useEffect } from "react";
import axios from "axios";

const PaymentConfirmation = () => {
  const [appointmentId, setAppointmentId] = useState("");
  const [slip, setSlip] = useState(null);
  const [message, setMessage] = useState("");
  const [confirmed, setConfirmed] = useState(null);
  const patientId = 48; 

  useEffect(() => {
    // Check for confirmed appointment
    axios
      .get(`http://localhost:5000/api/appointments/confirmed/${patientId}`)
      .then((res) => {
        if (res.data.message) {
          setConfirmed(null);
        } else {
          setConfirmed(res.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching confirmation:", err);
      });
  }, [message]);

  const handleFileChange = (e) => {
    setSlip(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!appointmentId || !slip) {
      setMessage("Please select an appointment and upload your payment slip.");
      return;
    }

    const formData = new FormData();
    formData.append("slip", slip);

    try {
      const res = await axios.post(
        `http://localhost:5000/api/appointments/upload-slip/${appointmentId}`,
        formData
      );
      setMessage(res.data.message);
    } catch (err) {
      console.error("Upload error:", err);
      setMessage("Failed to upload payment slip.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h3 className="text-primary mb-4 text-center">Appointment Payment</h3>

        {confirmed ? (
          <div className="alert alert-success">
            <h5 className="mb-3">Your Appointment is Confirmed!</h5>
            <p><strong>Doctor:</strong> {confirmed.doctor_name}</p>
            <p><strong>Date:</strong> {new Date(confirmed.appointment_date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {confirmed.consultation_time}</p>
            {confirmed.mode === "physical" ? (
              <p><strong>Location:</strong> {confirmed.location}</p>
            ) : (
              <p><strong>Join via Zoom:</strong> <a href={confirmed.zoom_link} target="_blank" rel="noreferrer">{confirmed.zoom_link}</a></p>
            )}
          </div>
        ) : (
          <>
            <div className="alert alert-info">
              <strong>Note:</strong> Please transfer the payment to:
              <ul className="mt-2">
                <li><strong>Account Number:</strong> 804567231</li>
                <li><strong>Account Name:</strong> MediConnect Hospital</li>
                <li><strong>Bank:</strong> National Medical Bank</li>
              </ul>
              After payment, upload your deposit slip or screenshot below.
            </div>

            <form onSubmit={handleUpload}>
              <div className="mb-3">
                <label className="form-label">Enter Your Appointment ID</label>
                <input
                  type="text"
                  className="form-control"
                  value={appointmentId}
                  onChange={(e) => setAppointmentId(e.target.value)}
                  placeholder="e.g., 102"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Upload Payment Slip</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  required
                />
              </div>

              <button className="btn btn-success w-100" type="submit">
                Submit Payment
              </button>
            </form>
          </>
        )}

        {message && <div className="alert alert-info mt-3">{message}</div>}
      </div>
    </div>
  );
};

export default PaymentConfirmation;