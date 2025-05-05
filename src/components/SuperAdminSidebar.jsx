import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUserShield,
  FaPlusCircle,
  FaListAlt,
  FaSignOutAlt,
} from "react-icons/fa";

const SuperAdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      navigate("/");
    }
  };

  return (
    <div className="superadmin-sidebar bg-white shadow-sm p-3">
      <h4 className="text-primary text-center fw-bold mb-4">MediConnect</h4>
      <ul className="nav flex-column">

        {/* Dashboard */}
        <li className="nav-item">
          <Link to="/superadmin-dashboard" className="nav-link">
            <FaHome className="me-2" /> Dashboard
          </Link>
        </li>

        {/* View Registered Admins */}
        <li className="nav-item">
          <Link to="/superadmin-dashboard/view-admins" className="nav-link">
            <FaUserShield className="me-2" /> View Registered Admins
          </Link>
        </li>

        {/* Add New Admin */}
        <li className="nav-item">
          <Link to="/superadmin-dashboard/add-admin" className="nav-link">
            <FaPlusCircle className="me-2" /> Add New Admin
          </Link>
        </li>

        {/* Pending Admins for Approval */}
        <li className="nav-item">
          <Link to="/superadmin-dashboard/pending-admins" className="nav-link">
            <FaListAlt className="me-2" /> Pending Admins
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

export default SuperAdminSidebar;