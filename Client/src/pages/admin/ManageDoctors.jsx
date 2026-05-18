import { useEffect, useState } from "react";
import PageWrapper from "../../components/layout/PageWrapper";
import EmptyState from "../../components/common/EmptyState";
import api from "../../api/axios";
import toast from "react-hot-toast";

const initialForm = {
  name: "",
  email: "",
  password: "",
  specialization: "",
  phone: "",
};

export default function ManageDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const loadDoctors = async () => {
    const res = await api.get("/users?role=doctor");
    setDoctors(res.data.data || []);
  };

  useEffect(() => {
    loadDoctors().catch(() => toast.error("Unable to load clinicians"));
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
      await api.post("/users", { ...form, role: "doctor" });
      toast.success("Clinician added");
      setForm(initialForm);
      loadDoctors();
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to add clinician");
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id, isActive) => {
    try {
      // When activating a doctor, also mark them as approved for booking.
      if (!isActive) {
        await api.patch(`/users/admin/approve-doctor/${id}`);
        toast.success("Clinician approved");
      } else {
        // When deactivating, keep approval status as-is, but stop booking.
        await api.put(`/users/${id}`, { isActive: false });
        toast.success("Clinician access deactivated");
      }

      loadDoctors();
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to update access");
    }
  };

  return (
    <PageWrapper
      title="Clinician Management"
      breadcrumb={["Admin", "Clinicians"]}
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
            placeholder="Specialization"
            value={form.specialization}
            onChange={(e) =>
              setForm({ ...form, specialization: e.target.value })
            }
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
            {loading ? "Saving..." : "Add Clinician"}
          </button>
        </form>

        {doctors.length === 0 ? (
          <EmptyState
            title="No clinicians"
            message="Add your first clinician"
          />
        ) : (
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="py-2">Name</th>
                  <th>Email</th>
                  <th>Specialization</th>
                  <th>Approval</th>
                  <th>Access</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doc) => (
                  <tr key={doc._id} className="border-t">
                    <td className="py-2">{doc.name}</td>
                    <td>{doc.email}</td>
                    <td>{doc.specialization || "-"}</td>
                    <td className="capitalize">
                      {doc.doctorApprovalStatus || "pending"}
                    </td>
                    <td>{doc.isActive ? "Active" : "Inactive"}</td>
                    <td className="text-right">
                      <div className="flex items-center gap-2">
                        {!doc.isActive ? (
                          <button
                            className="btn-secondary"
                            onClick={() => toggleActive(doc._id, doc.isActive)}
                          >
                            Approve & Activate
                          </button>
                        ) : (
                          <button
                            className="btn-secondary"
                            onClick={() => toggleActive(doc._id, doc.isActive)}
                          >
                            Deactivate access
                          </button>
                        )}
                      </div>
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
