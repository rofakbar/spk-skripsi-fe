import AdminDashboard from "./AdminDashboard";
import StudentDashboard from "./StudentDashboard";
import useSessionTimeout from '../hooks/useSessionTimeout';

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const role = user?.role?.[0];

  useSessionTimeout(15); // Set timeout ke 15 menit

  return role === "admin" ? <AdminDashboard /> : <StudentDashboard />;
}
