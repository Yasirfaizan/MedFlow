import { useMemo } from "react";
import { useAuth } from "../context/AuthContext";

export default function useRole() {
  const { user } = useAuth();
  return useMemo(() => user?.role, [user]);
}
