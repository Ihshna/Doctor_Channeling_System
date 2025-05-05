import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PatientHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/patient-history')
      .then(res => {
        setHistory(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching patient history', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center mt-10 text-lg font-medium">Loading patient history...</div>;
  if (history.length === 0) return <div className="text-center mt-10 text-lg font-medium">No patient history found.</div>;

  return (
    <div className="p-6 overflow-auto">
      <h1 className="text-2xl font-semibold mb-4 text-gray-700">Patient History</h1>
      <div className="overflow-x-auto shadow border border-gray-200 rounded-lg">
        <table className="min-w-[1200px] w-full table-auto text-sm text-left text-gray-600">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Age</th>
              <th className="px-4 py-3 font-semibold">Gender</th>
              <th className="px-4 py-3 font-semibold">History</th>
              <th className="px-4 py-3 font-semibold">Hypertension</th>
              <th className="px-4 py-3 font-semibold">Heart Disease</th>
              <th className="px-4 py-3 font-semibold">Smoking</th>
              <th className="px-4 py-3 font-semibold">BMI</th>
              <th className="px-4 py-3 font-semibold">HbA1c</th>
              <th className="px-4 py-3 font-semibold">Glucose</th>
              <th className="px-4 py-3 font-semibold">Diabetes</th>
              <th className="px-4 py-3 font-semibold">Prescribed Date</th>
              <th className="px-4 py-3 font-semibold">Doctor Notes</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {history.map((record, index) => (
              <tr key={index} className="hover:bg-gray-50 transition duration-150">
                <td className="px-4 py-2">{record.patient_name}</td>
                <td className="px-4 py-2">{record.age}</td>
                <td className="px-4 py-2">{record.gender}</td>
                <td className="px-4 py-2">{record.medical_history}</td>
                <td className="px-4 py-2">{record.hypertension ? 'Yes' : 'No'}</td>
                <td className="px-4 py-2">{record.heart_disease ? 'Yes' : 'No'}</td>
                <td className="px-4 py-2">{record.smoking_history}</td>
                <td className="px-4 py-2">{record.bmi}</td>
                <td className="px-4 py-2">{record.hba1c_level}</td>
                <td className="px-4 py-2">{record.blood_glucose_level}</td>
                <td className="px-4 py-2">{record.diabetes ? 'Yes' : 'No'}</td>
                <td className="px-4 py-2">{new Date(record.prescribed_date).toLocaleDateString()}</td>
                <td className="px-4 py-2 text-gray-700">{record.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientHistory;