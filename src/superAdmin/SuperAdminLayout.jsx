import React from "react";
import SuperAdminSidebar from "../components/SuperAdminSidebar";
import { Outlet } from "react-router-dom";

const SuperAdminLayout = () => {
  return (
    <div className="d-flex min-vh-100 bg-light">
      <SuperAdminSidebar />
      <div className="flex-grow-1">
        
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;