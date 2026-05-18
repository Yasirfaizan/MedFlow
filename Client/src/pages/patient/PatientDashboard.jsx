import PageWrapper from "../../components/layout/PageWrapper";
import { useAuth } from "../../context/AuthContext";

export default function PatientDashboard() {
  const { user } = useAuth();
  return (
    <PageWrapper
      title="Patient Dashboard"
      breadcrumb={["Patient", "Dashboard"]}
    >
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900">
          Patient Overview
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {user?.name} • {user?.email}
        </p>
        <p className="text-sm text-gray-500 mt-4">
          Access appointments and prescriptions from the navigation panel.
        </p>
      </div>
    </PageWrapper>
  );
}
