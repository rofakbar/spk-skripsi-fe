import AdminNavbar from "../components/admin/AdminNavbar";
import AdminSidebar from "../components/admin/AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f5f6f8] flex">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <AdminNavbar />

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
