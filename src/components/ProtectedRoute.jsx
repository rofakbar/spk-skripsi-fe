import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem("token");

  const user = JSON.parse(localStorage.getItem("user"));

  const role = user?.role?.[0];

  // Belum login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Role tidak sesuai
  if (allowedRole && role !== allowedRole) {
    return (
      <Navigate
        to={role === "admin" ? "/dashboard" : "/student/questionnaire"}
        replace
      />
    );
  }

  return children;
}
