import { useAuth } from "../context/AuthContext";

export default function useAuthState() {
  return useAuth();
}
