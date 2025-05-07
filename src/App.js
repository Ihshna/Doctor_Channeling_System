
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
import DoctorDashboard from './doctor/DoctorDashboard';
import DoctorAppointments from './doctor/DoctorAppointments';
import PatientHistory from './doctor/PatientHistory';
import WritePrescription from './doctor/WritePrescription';
import DoctorRecommendations from './doctor/DoctorRecommendations';

//Super admin
import SuperAdminLayout from './superAdmin/SuperAdminLayout';
import SuperAdminDashboard from './superAdmin/SuperAdminDashboard';
import AdminList from './superAdmin/AdminList';
import AddAdminForm from './superAdmin/AddAdminForm';
import PendingAdmins from './superAdmin/PendingAdmins';

//Patient
import PatientLayout from './patient/PatientLayout';
import PatientDashboard from './patient/PatientDashboard';
import UpdateProfile from './patient/UpdateProfile';
import MedicalHistory from './patient/MedicalHistory';
import EnterReading from './patient/EnterReading';
import HealthReadingHistory from './patient/HealthReadingHistory';
import HealthTrends from './patient/HealthTrends';
import PredictiveSuggestions from './patient/PredictiveSuggestions';
import BrowseDoctors from './patient/BrowseDoctors';
import PaymentConfirmation from './patient/PaymentConfirmation';
import PrescriptionHistory from './patient/PrescriptionHistory';

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
          <Route index element={<DoctorDashboard/>} />
          <Route path="appointments" element={<DoctorAppointments />} />
          <Route path="patients/history" element={<PatientHistory />} />
          <Route path="prescriptions/patients" element={<WritePrescription />} />
          <Route path="recommendations" element={<DoctorRecommendations />} />
        </Route>

        <Route path="/superadmin-dashboard" element={<SuperAdminLayout/>} >
          <Route index element={<SuperAdminDashboard/>} />
          <Route path="view-admins" element={<AdminList />} />
          <Route path="add-admin" element={<AddAdminForm />} />
          <Route path="pending-admins" element={<PendingAdmins />} />
        </Route>

        <Route path="/patient-dashboard" element={<PatientLayout/>} >
          <Route index element={<PatientDashboard/>} />
          <Route path="profile" element={<UpdateProfile />} />
          <Route path="medical-history" element={<MedicalHistory patientId={48} />} />
          <Route path="health-readings/new" element={<EnterReading patientId={48} />} />
          <Route path="health-readings/history" element={<HealthReadingHistory patientId={48} />} />
          <Route path="health-readings/trends" element={<HealthTrends patientId={48} />} />
          <Route path="predictive-suggestions" element={<PredictiveSuggestions />} />
          <Route path="doctors" element={<BrowseDoctors />} />
          <Route path="payment" element={<PaymentConfirmation />} />
          <Route path="prescriptions" element={<PrescriptionHistory />} />
        </Route>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;

