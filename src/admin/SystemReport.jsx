import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const SystemReport = () => {
  const [report, setReport] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/system-report')
      .then(res => setReport(res.data))
      .catch(err => console.error("Error fetching report", err));
  }, []);

  const downloadPDF = () => {
    const reportDiv = document.getElementById("report-content");
    html2canvas(reportDiv).then(canvas => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save("System_Report.pdf");
    });
  };

  if (!report) return <p>Loading report...</p>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>System Report</h3>
        <button onClick={downloadPDF} className="btn btn-primary">Download PDF</button>
      </div>

      <div id="report-content" className="row g-3">
        <InfoBox label="Total Patients" value={report.total_patients} color="info" />
        <InfoBox label="Total Doctors" value={report.total_doctors} color="success" />
        <InfoBox label="Appointments" value={report.total_appointments} color="primary" />
        <InfoBox label="Completed" value={report.completed_appointments} color="dark" />
        <InfoBox label="Pending" value={report.pending_appointments} color="warning" />
      </div>
    </div>
  );
};

const InfoBox = ({ label, value, color }) => (
  <div className="col-md-4">
    <div className={`card border-${color}`}>
      <div className={`card-body text-${color}`}>
        <h5 className="card-title">{label}</h5>
        <h3 className="card-text">{value}</h3>
      </div>
    </div>
  </div>
);

export default SystemReport;