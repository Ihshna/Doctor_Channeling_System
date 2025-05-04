import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaUserMd,
  FaUsers,
  FaCalendarCheck,
  FaFileMedical,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaUserPlus,
  FaUserEdit,
  FaListAlt,
  FaClipboardList
} from "react-icons/fa";

const AdminSidebar = () => {
  const [openDoctors, setOpenDoctors] = useState(false);
  const [openPatients, setOpenPatients] = useState(false);
  const [openReports, setOpenReports] = useState(false);

  return (
    <div className="admin-sidebar bg-white shadow-sm p-3">
      <h4 className="text-primary text-center fw-bold mb-4">MediConnect</h4>
      <ul className="nav flex-column">

        <li className="nav-item">
          <Link to="/admin-dashboard" className="nav-link">
            <FaHome className="me-2" /> Dashboard
          </Link>
        </li>

        {/* Doctors Menu */}
        <li className="nav-item">
          <button className="nav-link btn btn-link text-start w-100" onClick={() => setOpenDoctors(!openDoctors)}>
            <FaUserMd className="me-2" /> Doctors
          </button>
          {openDoctors && (
            <ul className="nav flex-column ms-3 fade-in">
              <li><Link to="/admin-dashboard/doctors/pending" className="nav-link">Pending Approvals</Link></li>
              <li><Link to="/admin-dashboard/doctors/list" className="nav-link">Manage Doctors</Link></li>
            </ul>
          )}
        </li>

        {/* Patients Menu */}
        <li className="nav-item">
          <button className="nav-link btn btn-link text-start w-100" onClick={() => setOpenPatients(!openPatients)}>
            <FaUsers className="me-2" /> Patients
          </button>
          {openPatients && (
            <ul className="nav flex-column ms-3 fade-in">
              <li><Link to="/admin-dashboard/patients" className="nav-link">Manage Patients</Link></li>
            </ul>
          )}
        </li>

        <li className="nav-item">
          <Link to="/admin-dashboard/schedule" className="nav-link">
            <FaClipboardList className="me-2" /> Channeling Schedule
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/admin-dashboard/appointments" className="nav-link">
            <FaCalendarCheck className="me-2" /> Appointments
          </Link>
        </li>

        {/* Reports Menu */}
        <li className="nav-item">
          <button className="nav-link btn btn-link text-start w-100" onClick={() => setOpenReports(!openReports)}>
            <FaChartBar className="me-2" /> Reports
          </button>
          {openReports && (
            <ul className="nav flex-column ms-3 fade-in">
              <li><Link to="/admin/reports/system" className="nav-link">System Reports</Link></li>
              <li><Link to="/admin/reports/graphs" className="nav-link">Charts/Graphs</Link></li>
            </ul>
          )}
        </li>

        <li className="nav-item">
          <Link to="/admin/settings" className="nav-link">
            <FaCog className="me-2" /> Settings
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/login" className="nav-link text-danger">
            <FaSignOutAlt className="me-2" /> Logout
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;