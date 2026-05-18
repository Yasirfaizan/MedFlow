import { useEffect, useState } from "react";
import PageWrapper from "../../components/layout/PageWrapper";
import EmptyState from "../../components/common/EmptyState";
import api from "../../api/axios";
import toast from "react-hot-toast";

const initialForm = {
  name: "",
  email: "",
  password: "",
  phone: "",
};

export default function ManageReceptionists() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const loadReceptionists = async () => {
    const res = await api.get("/users?role=receptionist");
    setUsers(res.data.data || []);
  };

  useEffect(() => {
    loadReceptionists().catch(() =>
      toast.error("Unable to load reception staff"),
    );
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = {};
    ["name", "email", "password"].forEach((field) => {
      if (!form[field]) nextErrors[field] = "Required";
    });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setLoading(true);
    try {
      await api.post("/users", { ...form, role: "receptionist" });
      toast.success("Reception staff added");
      setForm(initialForm);
      loadReceptionists();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Unable to add reception staff",
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id, isActive) => {
    try {
      await api.put(`/users/${id}`, { isActive: !isActive });
      toast.success("Access updated");
      loadReceptionists();
    } catch (err) {
      toast.error("Unable to update access");
    }
  };

  return (
    <PageWrapper
      title="Reception Staff Management"
      breadcrumb={["Admin", "Reception Staff"]}
    >
      <div className="space-y-6">
        <form
          onSubmit={onSubmit}
          className="card grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            className="input-field"
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="input-field"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="input-field"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <input
            className="input-field"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          {Object.keys(errors).length > 0 && (
            <p className="text-xs text-red-500 md:col-span-2">
              Name, email, and password are required.
            </p>
          )}
          <button className="btn-primary" disabled={loading} type="submit">
            {loading ? "Saving..." : "Add reception staff"}
          </button>
        </form>

        {users.length === 0 ? (
          <EmptyState
            title="No reception staff"
            message="Add your first reception staff member"
          />
        ) : (
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="py-2">Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Approval</th>
                  <th>Access</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.map((rec) => (
                  <tr key={rec._id} className="border-t">
                    <td className="py-2">{rec.name}</td>
                    <td>{rec.email}</td>
                    <td>{rec.phone || "-"}</td>
                    <td className="capitalize">
                      {rec.receptionistApprovalStatus || "pending"}
                    </td>
                    <td>{rec.isActive ? "Active" : "Inactive"}</td>
                    <td className="text-right">
                      <button
                        className="btn-secondary"
                        onClick={() => toggleActive(rec._id, rec.isActive)}
                      >
                        {rec.isActive ? "Deactivate access" : "Activate access"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
