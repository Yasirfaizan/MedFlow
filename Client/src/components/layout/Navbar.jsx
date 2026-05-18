import { Menu } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useUI } from "../../context/UIContext";

export default function Navbar({ breadcrumb = [] }) {
  const { user, logout } = useAuth();
  const { toggleSidebar } = useUI();

  return (
    <header className="flex items-center justify-between bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          aria-label="Toggle sidebar"
        >
          <Menu size={18} />
        </button>
        <div>
          <div className="text-xs text-gray-400">
            {breadcrumb.length
              ? breadcrumb.map((item, idx) => (
                  <span key={item}>
                    {item}
                    {idx < breadcrumb.length - 1 ? " / " : ""}
                  </span>
                ))
              : "Dashboard"}
          </div>
          <div className="text-sm font-semibold text-gray-900 capitalize">
            {breadcrumb[breadcrumb.length - 1] || "Overview"}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs bg-primary-50 text-primary-600 px-2 py-1 rounded-full capitalize">
          {user?.role}
        </span>
        <div className="text-sm font-medium text-gray-700">{user?.name}</div>
        <button className="btn-secondary" onClick={() => logout()}>
          Logout
        </button>
      </div>
    </header>
  );
}
