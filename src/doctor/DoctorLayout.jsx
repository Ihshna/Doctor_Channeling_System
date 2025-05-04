import React from "react";
import DoctorSidebar from "../components/DoctorSidebar";
import { Outlet } from "react-router-dom";

const DoctorLayout = () => {
  return (
    <div className="d-flex min-vh-100 bg-light">
      <DoctorSidebar />
      <div className="flex-grow-1">
        
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DoctorLayout;