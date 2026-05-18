import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { UIProvider } from "./context/UIContext";
import RoleRoute from "./components/common/RoleRoute";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageDoctors from "./pages/admin/ManageDoctors";
import ManageReceptionists from "./pages/admin/ManageReceptionists";
import SubscriptionManager from "./pages/admin/SubscriptionManager";
import ManagePrescriptions from "./pages/admin/ManagePrescriptions";

import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import MySchedule from "./pages/doctor/MySchedule";
import PatientProfile from "./pages/doctor/PatientProfile";
import AddDiagnosis from "./pages/doctor/AddDiagnosis";
import WritePrescription from "./pages/doctor/WritePrescription";

import ReceptionistDashboard from "./pages/receptionist/ReceptionistDashboard";
import RoleSelectionHomepage from "./pages/RoleSelectionHomepage";

import RegisterPatient from "./pages/receptionist/RegisterPatient";
import BookAppointment from "./pages/receptionist/BookAppointment";
import DailySchedule from "./pages/receptionist/DailySchedule";

import PatientDashboard from "./pages/patient/PatientDashboard";
import MyAppointments from "./pages/patient/MyAppointments";
import MyPrescriptions from "./pages/patient/MyPrescriptions";
import PrescriptionDetail from "./pages/patient/PrescriptionDetail";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<RoleSelectionHomepage />} />

    <Route path="/login" element={<Login />} />
    <Route path="/login/:role" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/signup/:role" element={<Signup />} />

    <Route path="/unauthorized" element={<Unauthorized />} />

    <Route
      path="/admin"
      element={
        <RoleRoute roles={["admin"]}>
          <AdminDashboard />
        </RoleRoute>
      }
    />
    <Route
      path="/admin/doctors"
      element={
        <RoleRoute roles={["admin"]}>
          <ManageDoctors />
        </RoleRoute>
      }
    />
    <Route
      path="/admin/receptionists"
      element={
        <RoleRoute roles={["admin"]}>
          <ManageReceptionists />
        </RoleRoute>
      }
    />
    <Route
      path="/admin/subscriptions"
      element={
        <RoleRoute roles={["admin"]}>
          <SubscriptionManager />
        </RoleRoute>
      }
    />
    <Route
      path="/admin/prescriptions"
      element={
        <RoleRoute roles={["admin"]}>
          <ManagePrescriptions />
        </RoleRoute>
      }
    />

    <Route
      path="/doctor"
      element={
        <RoleRoute roles={["doctor"]}>
          <DoctorDashboard />
        </RoleRoute>
      }
    />
    <Route
      path="/doctor/schedule"
      element={
        <RoleRoute roles={["doctor"]}>
          <MySchedule />
        </RoleRoute>
      }
    />
    <Route
      path="/doctor/patients/:id"
      element={
        <RoleRoute roles={["doctor", "admin"]}>
          <PatientProfile />
        </RoleRoute>
      }
    />
    <Route
      path="/doctor/diagnosis/:patientId"
      element={
        <RoleRoute roles={["doctor"]}>
          <AddDiagnosis />
        </RoleRoute>
      }
    />
    <Route
      path="/doctor/prescription/:patientId"
      element={
        <RoleRoute roles={["doctor"]}>
          <WritePrescription />
        </RoleRoute>
      }
    />

    <Route
      path="/receptionist"
      element={
        <RoleRoute roles={["receptionist"]}>
          <ReceptionistDashboard />
        </RoleRoute>
      }
    />
    <Route
      path="/receptionist/register"
      element={
        <RoleRoute roles={["receptionist"]}>
          <RegisterPatient />
        </RoleRoute>
      }
    />
    <Route
      path="/receptionist/book"
      element={
        <RoleRoute roles={["receptionist"]}>
          <BookAppointment />
        </RoleRoute>
      }
    />
    <Route
      path="/receptionist/schedule"
      element={
        <RoleRoute roles={["receptionist"]}>
          <DailySchedule />
        </RoleRoute>
      }
    />

    <Route
      path="/patient"
      element={
        <RoleRoute roles={["patient"]}>
          <PatientDashboard />
        </RoleRoute>
      }
    />
    <Route
      path="/patient/appointments"
      element={
        <RoleRoute roles={["patient"]}>
          <MyAppointments />
        </RoleRoute>
      }
    />
    <Route
      path="/patient/prescriptions"
      element={
        <RoleRoute roles={["patient"]}>
          <MyPrescriptions />
        </RoleRoute>
      }
    />
    <Route
      path="/patient/prescriptions/:id"
      element={
        <RoleRoute roles={["patient"]}>
          <PrescriptionDetail />
        </RoleRoute>
      }
    />

    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default function App() {
  return (
    <AuthProvider>
      <UIProvider>
        <BrowserRouter>
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
          <AppRoutes />
        </BrowserRouter>
      </UIProvider>
    </AuthProvider>
  );
}
