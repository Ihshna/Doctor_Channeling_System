import React, { useState } from "react";
import axios from "axios";

const EnterReading = ({ patientId }) => {
  const [formData, setFormData] = useState({
    reading_date: new Date().toISOString().split("T")[0],
    blood_sugar: "",
    weight: "",
    blood_pressure: "",
    notes: "",
    bmi: "",
    hypertension: "0",
    heart_disease: "0",
    HbA1c_level: "",
    blood_glucose_level: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/api/health-readings", {
        ...formData,
        patient_id: patientId,
      })
      .then((res) => {
        setMessage("Reading submitted successfully!");
        setFormData({
          reading_date: new Date().toISOString().split("T")[0],
          blood_sugar: "",
          weight: "",
          blood_pressure: "",
          notes: "",
          bmi: "",
          hypertension: "0",
          heart_disease: "0",
          HbA1c_level: "",
          blood_glucose_level: "",
        });
      })
      .catch((err) => {
        console.error("Submit error:", err);
        setMessage("Failed to submit reading.");
      });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card shadow p-4">
            <h3 className="text-center mb-4 text-success">Enter Health Reading</h3>
            {message && (
              <div className="alert alert-info text-center">{message}</div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Reading Date</label>
                  <input
                    type="date"
                    name="reading_date"
                    value={formData.reading_date}
                    className="form-control"
                    onChange={handleChange}
                  />
                </div>


                
                <div className="col-md-6 mb-3">
                  <label className="form-label">BMI</label>
                  <input
                    type="number"
                    step="0.01"
                    name="bmi"
                    value={formData.bmi}
                    className="form-control"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Hypertension</label>
                  <select
                    name="hypertension"
                    value={formData.hypertension}
                    className="form-control"
                    onChange={handleChange}
                    required
                  >
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Heart Disease</label>
                  <select
                    name="heart_disease"
                    value={formData.heart_disease}
                    className="form-control"
                    onChange={handleChange}
                    required
                  >
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">HbA1c Level (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="HbA1c_level"
                    value={formData.HbA1c_level}
                    className="form-control"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Blood Glucose Level (mg/dL)</label>
                  <input
                    type="number"
                    name="blood_glucose_level"
                    value={formData.blood_glucose_level}
                    className="form-control"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Blood Sugar (mg/dL)</label>
                  <input
                    type="number"
                    name="blood_sugar"
                    value={formData.blood_sugar}
                    className="form-control"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Weight (kg)</label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    className="form-control"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-12 mb-3">
                  <label className="form-label">Blood Pressure (e.g., 120/80)</label>
                  <input
                    type="text"
                    name="blood_pressure"
                    value={formData.blood_pressure}
                    className="form-control"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-12 mb-3">
                  <label className="form-label">Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    className="form-control"
                    onChange={handleChange}
                    rows={3}
                  />
                </div>
              </div>

              <div className="d-grid">
                <button type="submit" className="btn btn-success">
                  Submit Reading
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterReading;
