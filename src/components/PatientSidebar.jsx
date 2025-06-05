import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaHeartbeat,
  FaLightbulb,
  FaUserMd,
  FaFileMedical,
  FaSignOutAlt
} from "react-icons/fa";

const PatientSidebar = () => {
  const [openProfile, setOpenProfile] = useState(false);
  const [openHealth, setOpenHealth] = useState(false);
  const [openDoctor, setOpenDoctor] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      navigate("/");
    }
  };

  return (
    <div className="admin-sidebar bg-white shadow-sm p-3">
      <h4 className="text-primary text-center fw-bold mb-4">MediConnect</h4>
      <ul className="nav flex-column">

        <li className="nav-item">
          <Link to="/patient-dashboard" className="nav-link">
            <FaHome className="me-2" /> Dashboard
          </Link>
        </li>

        {/* Profile Menu */}
        <li className="nav-item">
          <button className="nav-link btn btn-link text-start w-100" onClick={() => setOpenProfile(!openProfile)}>
            <FaUser className="me-2" /> Profile
          </button>
          {openProfile && (
            <ul className="nav flex-column ms-3 fade-in">
              <li><Link to="/patient-dashboard/profile" className="nav-link">Update Profile</Link></li>
            </ul>
          )}
        </li>

        {/* Health Readings Menu */}
        <li className="nav-item">
          <button className="nav-link btn btn-link text-start w-100" onClick={() => setOpenHealth(!openHealth)}>
            <FaHeartbeat className="me-2" /> Health Readings
          </button>
          {openHealth && (
            <ul className="nav flex-column ms-3 fade-in">
              <li><Link to="/patient-dashboard/health-readings/new" className="nav-link">Enter New Reading</Link></li>
              <li><Link to="/patient-dashboard/health-readings/history" className="nav-link">Reading History</Link></li>
              <li><Link to="/patient-dashboard/health-readings/trends" className="nav-link">Charts & Trends</Link></li>
            </ul>
          )}
        </li>

        <li className="nav-item">
          <Link to="/patient-dashboard/predictive-suggestions" className="nav-link">
            <FaLightbulb className="me-2" /> Predictive Suggestions
          </Link>
        </li>

        {/* Channel Doctor Menu */}
        <li className="nav-item">
          <button className="nav-link btn btn-link text-start w-100" onClick={() => setOpenDoctor(!openDoctor)}>
            <FaUserMd className="me-2" /> Channel a Doctor
          </button>
          {openDoctor && (
            <ul className="nav flex-column ms-3 fade-in">
              <li><Link to="/patient-dashboard/doctors" className="nav-link">Browse Doctors</Link></li>
            </ul>
          )}
        </li>

        <li className="nav-item">
          <Link to="/patient-dashboard/prescriptions" className="nav-link">
            <FaFileMedical className="me-2" /> Prescription History
          </Link>
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

export default PatientSidebar;