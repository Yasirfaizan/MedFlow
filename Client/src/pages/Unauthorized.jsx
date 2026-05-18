import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="card max-w-md text-center">
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          Access denied
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          You do not have permission to access this page.
        </p>
        <Link to="/login" className="btn-primary">
          Back to Login
        </Link>
      </div>
    </div>
  );
}
