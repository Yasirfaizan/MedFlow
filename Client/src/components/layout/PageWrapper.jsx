import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function PageWrapper({ title, breadcrumb = [], children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 lg:ml-56">
        <Navbar breadcrumb={breadcrumb.length ? breadcrumb : [title]} />
        <main className="p-6">
          {title && (
            <div className="mb-6">
              <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
