import Navbar from "../components/Navbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F7F8F8]">
      {/* Navbar */}
      <Navbar />

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
