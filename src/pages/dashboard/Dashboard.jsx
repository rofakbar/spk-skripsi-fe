import AdminDashboard from "./AdminDashboard";
import StudentDashboard from "./StudentDashboard";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const role = user?.role?.[0];

  return role === "admin" ? <AdminDashboard /> : <StudentDashboard />;
}
