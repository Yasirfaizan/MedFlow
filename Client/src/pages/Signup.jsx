import { useForm } from "react-hook-form";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import api from "../api/axios";
import { UserPlus, Loader2 } from "lucide-react";
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

export default function Signup() {
  const { role } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      role: role || "patient",
    },
  });

  // Redirect to selection homepage if no valid role matches
  if (!role || !roleConfig[role]) {
    return <Navigate to="/" replace />;
  }

  const config = roleConfig[role];

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/register", data);

      // Automatically log in the user after registering successfully
      const loginRes = await api.post("/auth/login", {
        email: data.email,
        password: data.password,
      });

      login(loginRes.data.data.token, loginRes.data.data.user);
      toast.success(res.data.message || `Account created successfully! Welcome, ${data.name}.`);
      
      const targetRole = loginRes.data.data.user.role;
      navigate(roleRedirects[targetRole]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className={`w-14 h-14 ${config.accent} rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-sm`}>
            <UserPlus size={28} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{config.title} Sign Up</h1>
          <p className="text-gray-400 text-sm mt-1">
            Create an account to access your {config.title.toLowerCase()} dashboard
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Bind role securely in a hidden input so the backend registers correctly */}
            <input type="hidden" value={role} {...register("role")} />

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Full name
              </label>
              <input
                {...register("name", {
                  required: "Name required",
                  minLength: { value: 2, message: "Name too short" },
                })}
                className="input-field"
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Email Address
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
                Phone Number
              </label>
              <input
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: { value: /^[0-9+\-\s]{7,15}$/, message: "Invalid phone number" },
                })}
                type="tel"
                className="input-field"
                placeholder="+1 555-0199"
                onKeyDown={(e) => {
                  // Allow: backspace, delete, tab, escape, enter, arrows, home, end
                  const allowed = [
                    "Backspace", "Delete", "Tab", "Escape", "Enter",
                    "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown",
                    "Home", "End",
                  ];
                  // Allow: +, -, space (valid phone chars)
                  const allowedChars = /^[0-9+\-\s]$/;
                  if (!allowed.includes(e.key) && !allowedChars.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                onPaste={(e) => {
                  const pasted = e.clipboardData.getData("text");
                  if (/[a-zA-Z]/.test(pasted)) {
                    e.preventDefault();
                  }
                }}
              />
              {errors.phone && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.phone.message}
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

            {/* Specialization field for doctors */}
            {role === "doctor" && (
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Specialization
                </label>
                <input
                  {...register("specialization", {
                    required: "Specialization is required",
                    minLength: { value: 2, message: "Too short" },
                  })}
                  className="input-field"
                  placeholder="e.g. Cardiology, Pediatrics, General Practice"
                />
                {errors.specialization && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.specialization.message}
                  </p>
                )}
              </div>
            )}

            {/* Age field for patients */}
            {role === "patient" && (
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Age
                </label>
                <input
                  {...register("age", {
                    required: "Age is required",
                    min: { value: 1, message: "Age must be at least 1" },
                    max: { value: 120, message: "Age must be 120 or below" },
                    valueAsNumber: true,
                  })}
                  type="number"
                  className="input-field"
                  placeholder="e.g. 28"
                  min={1}
                  max={120}
                />
                {errors.age && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.age.message}
                  </p>
                )}
              </div>
            )}

            {/* Enforce secret code field dynamically for the Admin signup flow */}
            {role === "admin" && (
              <div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 mb-2">
                  <p className="text-xs text-blue-500 font-medium mb-1">
                    🏆 Hackathon Demo — Admin Secret Code
                  </p>
                  <p className="text-xs text-blue-400 mb-1.5">
                    This key is exposed here for hackathon evaluation purposes only. In production, it would be distributed securely out-of-band.
                  </p>
                  <p className="text-xs text-blue-700 font-mono select-all bg-blue-100 rounded px-2 py-1">
                    MedFlowAdminSecretKey2026
                  </p>
                </div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Admin Secret Code
                </label>
                <input
                  {...register("adminSecretCode", {
                    required: "Admin secret code required",
                  })}
                  type="password"
                  className="input-field"
                  placeholder="Enter administrator passcode"
                />
                {errors.adminSecretCode && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.adminSecretCode.message}
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 px-4 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 ${config.buttonAccent} focus:outline-none`}
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              {loading ? "Creating..." : "Sign Up"}
            </button>
          </form>

          <div className="mt-4 text-center text-xs text-gray-500">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate(`/login/${role}`)}
              className={`font-medium hover:underline ${config.textAccent}`}
            >
              Sign in
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
