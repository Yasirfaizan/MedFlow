import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

export default function RoleRoute({ children, roles = [] }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner fullScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role))
    return <Navigate to="/unauthorized" replace />;
  return children;
}
