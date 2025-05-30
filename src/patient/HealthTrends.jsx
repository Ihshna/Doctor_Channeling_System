import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

const HealthTrends = ({ patientId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pdfDownloading, setPdfDownloading] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/patient/${patientId}/health-trends`)
      .then((res) => {
        // Parse blood_pressure (e.g. "120/80") to systolic number (120)
        const parsedData = res.data.map((item) => {
          let bpValue = null;
          if (item.blood_pressure) {
            const parts = item.blood_pressure.split("/");
            if (parts.length === 2) {
              bpValue = Number(parts[0]); // take systolic value
            } else {
              bpValue = Number(item.blood_pressure); // fallback if no slash
            }
          }
          return {
            ...item,
            blood_pressure: bpValue,
          };
        });

        setData(parsedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching trends:", err);
        setLoading(false);
      });
  }, [patientId]);

  const handleDownloadPDF = () => {
    setPdfDownloading(true);
    axios({
      url: `http://localhost:5000/api/patient/${patientId}/health-trends/pdf`,
      method: "GET",
      responseType: "blob",
    })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `health_trends_${patientId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        setPdfDownloading(false);
      })
      .catch((err) => {
        console.error("Download error:", err);
        setPdfDownloading(false);
      });
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h3 className="text-center text-primary mb-4">Health Trends</h3>
        <div className="text-center">
          <button
            className="btn btn-outline-primary"
            onClick={handleDownloadPDF}
            disabled={pdfDownloading}
          >
            {pdfDownloading ? "Generating PDF..." : "Download PDF Report"}
          </button>
        </div>
        {loading ? (
          <p className="text-center">Loading data...</p>
        ) : (
          <>
            <div className="mb-4">
              <h5 className="text-secondary">Blood Sugar Trends</h5>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="reading_date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="blood_sugar"
                    stroke="#8884d8"
                    name="Blood Sugar"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mb-4">
              <h5 className="text-secondary">Weight Trends</h5>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="reading_date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#82ca9d"
                    name="Weight"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mb-4">
              <h5 className="text-secondary">Blood Pressure Trends</h5>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="reading_date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="blood_pressure"
                    stroke="#ff7300"
                    name="Blood Pressure (Systolic)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HealthTrends;
