import { useEffect, useState } from "react";
import PageWrapper from "../../components/layout/PageWrapper";
import api from "../../api/axios";
import toast from "react-hot-toast";

export default function SubscriptionManager() {
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    const res = await api.get("/users");
    setUsers(res.data.data || []);
  };

  useEffect(() => {
    loadUsers().catch(() => toast.error("Unable to load users"));
  }, []);

  const updatePlan = async (userId, subscriptionPlan) => {
    try {
      await api.patch("/users/admin/upgrade-plan", {
        userId,
        subscriptionPlan,
      });
      toast.success("Subscription updated");
      loadUsers();
    } catch (err) {
      toast.error("Unable to update subscription");
    }
  };

  return (
    <PageWrapper
      title="Subscription Administration"
      breadcrumb={["Admin", "Subscriptions"]}
    >
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500">
              <th className="py-2">User</th>
              <th>Role</th>
              <th>Plan</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="py-2">{user.name}</td>
                <td className="capitalize">{user.role}</td>
                <td className="capitalize">{user.subscriptionPlan}</td>
                <td className="text-right">
                  {user.subscriptionPlan === "free" ? (
                    <button
                      className="btn-primary"
                      onClick={() => updatePlan(user._id, "pro")}
                    >
                      Upgrade to Pro
                    </button>
                  ) : (
                    <button
                      className="btn-secondary"
                      onClick={() => updatePlan(user._id, "free")}
                    >
                      Downgrade to Free
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageWrapper>
  );
}
