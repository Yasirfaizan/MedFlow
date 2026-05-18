import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useUI } from "../../context/UIContext";
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  UserPlus,
  ClipboardList,
  Stethoscope,
  LogOut,
  Shield,
} from "lucide-react";

const navConfig = {
  admin: [
    { to: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/admin/doctors", icon: Stethoscope, label: "Doctors" },
    { to: "/admin/receptionists", icon: Users, label: "Receptionists" },
    { to: "/admin/subscriptions", icon: Shield, label: "Subscriptions" },
    { to: "/admin/prescriptions", icon: FileText, label: "Prescriptions" },
  ],
  doctor: [
    { to: "/doctor", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/doctor/schedule", icon: Calendar, label: "My Schedule" },
  ],
  receptionist: [
    { to: "/receptionist", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/receptionist/register", icon: UserPlus, label: "Register Patient" },
    { to: "/receptionist/book", icon: Calendar, label: "Book Appointment" },
    {
      to: "/receptionist/schedule",
      icon: ClipboardList,
      label: "Daily Schedule",
    },
  ],
  patient: [
    { to: "/patient", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/patient/appointments", icon: Calendar, label: "Appointments" },
    { to: "/patient/prescriptions", icon: FileText, label: "Prescriptions" },
  ],
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { sidebarOpen, closeSidebar } = useUI();
  const links = navConfig[user?.role] || [];

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          onClick={closeSidebar}
        />
      )}
      <aside
        className={`w-56 bg-white border-r border-gray-100 flex flex-col h-screen fixed left-0 top-0 z-30 transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <Stethoscope size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">MedFlow</p>
              <p className="text-xs text-gray-400">Clinic Management</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === `/${user?.role}`}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
              onClick={closeSidebar}
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-100">
          <div className="flex items-center gap-2 p-2 rounded-lg mb-2">
            <div className="w-7 h-7 rounded-full bg-primary-50 flex items-center justify-center text-xs font-semibold text-primary-600">
              {user?.name?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
            </div>
            {user?.subscriptionPlan === "pro" && (
              <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded font-medium">
                PRO
              </span>
            )}
          </div>
          <button
            onClick={() => {
              logout();
              navigate("/login");
              closeSidebar();
            }}
            className="sidebar-link w-full text-red-500 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
