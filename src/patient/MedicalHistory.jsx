import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";

const fieldLabels = {
  medical_history: "Medical History",
  hypertension: "Hypertension",
  heart_disease: "Heart Disease",
  smoking_history: "Smoking History",
  bmi: "BMI",
  HbA1c_level: "HbA1c Level",
  blood_glucose_level: "Blood Glucose Level",
  diabetes: "Diabetes",
};

const MedicalHistory = ({ patientId }) => {
  const [data, setData] = useState({});
  const [editField, setEditField] = useState(null);
  const [inputValue, setInputValue] = useState("");

  const fetchHistory = () => {
    axios
      .get(`http://localhost:5000/api/patient/${patientId}/medical-history`)
      .then((res) => setData(res.data))
      .catch((err) => console.error("Error fetching medical history:", err));
  };

  useEffect(() => {
    fetchHistory();
  }, [patientId]);

  const handleEdit = (field) => {
    setEditField(field);
    setInputValue(data[field] || "");
  };

  const handleSave = () => {
    axios
      .put(`http://localhost:5000/api/patient/${patientId}/medical-history`, {
        field: editField,
        value: inputValue,
      })
      .then(() => {
        fetchHistory();
        setEditField(null);
      })
      .catch((err) => console.error("Error saving:", err));
  };


  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4">
        <h3 className="mb-4 text-primary text-center">Medical History</h3>

        {Object.entries(fieldLabels).map(([field, label]) => (
          <div key={field} className="d-flex align-items-center justify-content-between border-bottom py-2">
            <div className="flex-grow-1">
              <strong>{label}:</strong>{" "}
              {editField === field ? (
                <input
                  type="text"
                  className="form-control d-inline w-75"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              ) : (
                <span className="ms-2">{data[field] || "—"}</span>
              )}
            </div>

            <div className="ms-3">
              {editField === field ? (
                <>
                  <button className="btn btn-success btn-sm me-2" onClick={handleSave}>
                    <FaSave />
                  </button>
                  <button className="btn btn-secondary btn-sm" onClick={() => setEditField(null)}>
                    <FaTimes />
                  </button>
                </>
              ) : (
                <>
                  <button className="btn btn-outline-primary btn-sm me-2" onClick={() => handleEdit(field)}>
                    <FaEdit />
                  </button>
                  
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicalHistory;