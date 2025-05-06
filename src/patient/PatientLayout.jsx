import React from "react";
import PatientSidebar from "../components/PatientSidebar";
import { Outlet } from "react-router-dom";

const PatientLayout = () => {
  return (
    <div className="d-flex min-vh-100 bg-light">
      <PatientSidebar />
      <div className="flex-grow-1">
        
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PatientLayout;