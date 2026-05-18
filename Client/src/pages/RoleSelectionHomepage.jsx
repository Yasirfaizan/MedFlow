import { useNavigate } from "react-router-dom";
import { Stethoscope, Shield, User, CalendarCheck } from "lucide-react";

const ROLE_CARDS = [
  {
    role: "admin",
    title: "Admin",
    description: "Manage doctors, receptionists, and subscriptions.",
    icon: Shield,
    accent: "bg-blue-600",
  },
  {
    role: "doctor",
    title: "Doctor",
    description: "View schedule, add diagnoses, and write prescriptions.",
    icon: Stethoscope,
    accent: "bg-primary-500",
  },
  {
    role: "receptionist",
    title: "Receptionist",
    description: "Register patients and manage appointments.",
    icon: CalendarCheck,
    accent: "bg-yellow-500",
  },
  {
    role: "patient",
    title: "Patient",
    description: "Book appointments and view your prescriptions.",
    icon: User,
    accent: "bg-green-600",
  },
];

export default function RoleSelectionHomepage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-14 h-14 bg-primary-500 rounded-2xl flex items-center justify-center">
              <Stethoscope size={28} className="text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-gray-900">MedFlow</h1>
              <p className="text-gray-500 text-sm">
                Select your option below to continue
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ROLE_CARDS.map(
            ({ role, title, description, icon: Icon, accent }) => (
              <div
                key={role}
                className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-xl ${accent} flex items-center justify-center mb-4 text-white shadow-sm`}
                  >
                    <Icon size={22} />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 capitalize">
                    {title}
                  </h2>
                  <p className="text-sm text-gray-500 mt-2 min-h-[40px] leading-relaxed">
                    {description}
                  </p>
                </div>

                <div className="mt-6 space-y-2">
                  <button
                    onClick={() => {
                      localStorage.setItem("selectedRole", role);
                      navigate(`/login/${role}`);
                    }}
                    className={`w-full py-2.5 px-4 rounded-xl text-sm font-medium text-white transition-opacity flex items-center justify-center gap-1.5 ${accent} hover:opacity-90 focus:outline-none`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      localStorage.setItem("selectedRole", role);
                      navigate(`/signup/${role}`);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:text-gray-900 transition-colors flex items-center justify-center focus:outline-none"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            ),
          )}
        </div>

        <div className="mt-8 text-center text-xs text-gray-400">
          MedFlow Professional Clinic Management System &copy; 2026. All rights reserved.
        </div>
      </div>
    </div>
  );
}
