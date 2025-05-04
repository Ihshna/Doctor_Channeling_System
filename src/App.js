
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

//Admin
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import PendingDoctors from './admin/PendingDoctors';
import ManageDoctors from "./admin/ManageDoctors";
import ManagePatients from './admin/ManagePatients';
import ChannelingSchedule from './admin/ChannelingSchedule';
import Appointments from './admin/Appointment';
import SystemReport from './admin/SystemReport';

//Doctor
import DoctorLayout from './doctor/DoctorLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/admin-dashboard" element={<AdminLayout/>} >
          <Route index element={<AdminDashboard/>} />
          <Route path="doctors/pending" element={<PendingDoctors />} />
          <Route path="doctors/list" element={<ManageDoctors />} />
          <Route path="patients" element={<ManagePatients />} />
          <Route path="schedule" element={<ChannelingSchedule />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="system-report" element={<SystemReport />} />
        </Route>

        <Route path="/doctor-dashboard" element={<DoctorLayout/>} >
        
        </Route>


        
      </Routes>
    </BrowserRouter>
  );
}

export default App;

