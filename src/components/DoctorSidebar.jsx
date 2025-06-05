import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaCalendarCheck,
  FaUsers,
  FaFilePrescription,
  FaUserCog,
  FaSignOutAlt
} from "react-icons/fa";

const DoctorSidebar = () => {
  const [openPatients, setOpenPatients] = useState(false);
  const [openPrescriptions, setOpenPrescriptions] = useState(false);
  

  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      navigate("/");
    }
  };

  return (
    <div className="doctor-sidebar bg-white shadow-sm p-3">
      <h4 className="text-primary text-center fw-bold mb-4">MediConnect</h4>
      <ul className="nav flex-column">

        <li className="nav-item">
          <Link to="/doctor-dashboard" className="nav-link">
            <FaHome className="me-2" /> Dashboard
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/doctor-dashboard/appointments" className="nav-link">
            <FaCalendarCheck className="me-2" /> Appointments
          </Link>
        </li>

        {/* Patients */}
        <li className="nav-item">
          <button className="nav-link btn btn-link text-start w-100" onClick={() => setOpenPatients(!openPatients)}>
            <FaUsers className="me-2" /> Patients
          </button>
          {openPatients && (
            <ul className="nav flex-column ms-3 fade-in">
              <li><Link to="/doctor-dashboard/patients/history" className="nav-link">Patient History</Link></li>
            </ul>
          )}
        </li>

        {/* Prescriptions */}
        <li className="nav-item">
          <button className="nav-link btn btn-link text-start w-100" onClick={() => setOpenPrescriptions(!openPrescriptions)}>
            <FaFilePrescription className="me-2" /> Prescriptions
          </button>
          {openPrescriptions && (
            <ul className="nav flex-column ms-3 fade-in">
              <li><Link to="/doctor-dashboard/prescriptions/patients" className="nav-link">View All</Link></li>
            </ul>
          )}
        </li>


        {/* Logout */}
        <li className="nav-item">
          <button
            className="nav-link text-danger bg-transparent border-0 text-start w-100"
            onClick={handleLogout}
            style={{ cursor: "pointer" }}
          >
            <FaSignOutAlt className="me-2" /> Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default DoctorSidebar;