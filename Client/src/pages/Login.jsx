import { useForm } from "react-hook-form";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import api from "../api/axios";
import { Stethoscope, Loader2 } from "lucide-react";
import { useState } from "react";

const roleRedirects = {
  admin: "/admin",
  doctor: "/doctor",
  receptionist: "/receptionist",
  patient: "/patient",
};

const roleConfig = {
  admin: {
    title: "Admin",
    accent: "bg-blue-600",
    buttonAccent: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
    textAccent: "text-blue-600",
    placeholder: "admin@clinic.com",
  },
  doctor: {
    title: "Doctor",
    accent: "bg-primary-500",
    buttonAccent: "bg-primary-500 hover:bg-primary-600 focus:ring-primary-500",
    textAccent: "text-primary-600",
    placeholder: "doctor@clinic.com",
  },
  receptionist: {
    title: "Receptionist",
    accent: "bg-yellow-500",
    buttonAccent: "bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500",
    textAccent: "text-yellow-600",
    placeholder: "receptionist@clinic.com",
  },
  patient: {
    title: "Patient",
    accent: "bg-green-600",
    buttonAccent: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
    textAccent: "text-green-600",
    placeholder: "patient@clinic.com",
  },
};

export default function Login() {
  const { role } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Redirect to selection homepage if no valid role matches
  if (!role || !roleConfig[role]) {
    return <Navigate to="/" replace />;
  }

  const config = roleConfig[role];

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", data);
      const loggedInUser = res.data.data.user;

      // Restrict login to the selected role to avoid confusion
      if (loggedInUser.role !== role) {
        toast.error(
          `This account is registered as a ${loggedInUser.role}, not a ${role}.`,
        );
        return;
      }

      login(res.data.data.token, loggedInUser);
      toast.success(`Welcome back, ${loggedInUser.name}!`);
      navigate(roleRedirects[loggedInUser.role]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div
            className={`w-14 h-14 ${config.accent} rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-sm`}
          >
            <Stethoscope size={28} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {config.title} Access
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Secure sign-in for clinical operations
          </p>
        </div>
        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Email address
              </label>
              <input
                {...register("email", {
                  required: "Email required",
                  pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" },
                })}
                type="email"
                className="input-field"
                placeholder={config.placeholder}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Password
              </label>
              <input
                {...register("password", {
                  required: "Password required",
                  minLength: { value: 8, message: "Min 8 characters" },
                })}
                type="password"
                className="input-field"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 px-4 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 ${config.buttonAccent} focus:outline-none`}
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-4 text-center text-xs text-gray-500">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate(`/signup/${role}`)}
              className={`font-medium hover:underline ${config.textAccent}`}
            >
              Create {config.title} account
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-xs text-gray-400 font-medium hover:underline"
          >
            &larr; Choose a different role
          </button>
        </div>
      </div>
    </div>
  );
}
