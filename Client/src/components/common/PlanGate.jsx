import { useState } from "react";
import { Lock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Modal from "./Modal";
import api from "../../api/axios";
import toast from "react-hot-toast";

export default function PlanGate({ children, feature = "This feature" }) {
  const { user, login } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  if (user?.subscriptionPlan === "pro") return children;

  const requestUpgrade = async () => {
    setLoading(true);
    try {
      const res = await api.patch("/admin/upgrade-plan", {
        userId: user.id || user._id,
        subscriptionPlan: "pro",
      });
      login(localStorage.getItem("token"), res.data.data);
      toast.success("Plan upgraded to Pro");
      setOpen(false);
    } catch {
      toast.error("Please contact admin to upgrade your plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card flex flex-col items-center justify-center py-10 text-center">
      <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center mb-3">
        <Lock size={20} className="text-yellow-500" />
      </div>
      <p className="font-semibold text-gray-800 mb-1">{feature} requires Pro</p>
      <p className="text-sm text-gray-400 mb-4">
        Upgrade your plan to unlock this feature
      </p>
      <button className="btn-primary" onClick={() => setOpen(true)}>
        Upgrade to Pro
      </button>
      <Modal open={open} title="Upgrade Plan" onClose={() => setOpen(false)}>
        <p className="text-sm text-gray-600 mb-4">
          This feature requires a Pro subscription. Confirm upgrade?
        </p>
        <div className="flex justify-end gap-3">
          <button className="btn-secondary" onClick={() => setOpen(false)}>
            Cancel
          </button>
          <button
            className="btn-primary"
            onClick={requestUpgrade}
            disabled={loading}
          >
            {loading ? "Upgrading..." : "Upgrade"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
