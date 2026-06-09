import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import Dashboard from "../pages/dashboard/Dashboard";

import Criteria from "../pages/admin/Criteria";
import Weights from "../pages/admin/Weights";
import Alternatives from "../pages/admin/Alternatives";
import Students from "../pages/admin/Students";
import HistoryAdmin from "../pages/admin/HistoryAdmin";
import AlternativeCriteria from "../pages/admin/AlternativeCriteria";
import AdminProfile from "../pages/admin/AdminProfile";

import StudentQuestionnaire from "../pages/student/StudentQuestionnaire";
import StudentResult from "../pages/student/StudentResult";
import StudentResultDetail from "../pages/student/StudentResultDetail";

import Result from "../pages/result/Result";
import Profile from "../pages/profile/Profile";
import Waspas from "../pages/waspas/Waspas";
import History from "../pages/history/History";

import ProtectedRoute from "../components/ProtectedRoute";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* DEFAULT */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* ADMIN */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/criteria"
          element={
            <ProtectedRoute allowedRole="admin">
              <Criteria />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/weights"
          element={
            <ProtectedRoute allowedRole="admin">
              <Weights />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/alternative-criteria"
          element={
            <ProtectedRoute allowedRole="admin">
              <AlternativeCriteria />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/students"
          element={
            <ProtectedRoute allowedRole="admin">
              <Students />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/history-admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <HistoryAdmin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/alternatives"
          element={
            <ProtectedRoute allowedRole="admin">
              <Alternatives />
            </ProtectedRoute>
          }
        />

        {/* STUDENT */}
        <Route
          path="/student/questionnaire"
          element={
            <ProtectedRoute allowedRole="user">
              <StudentQuestionnaire />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/result"
          element={
            <ProtectedRoute allowedRole="user">
              <StudentResult />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/result/detail"
          element={
            <ProtectedRoute allowedRole="user">
              <StudentResultDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/result/history/:id"
          element={
            <ProtectedRoute allowedRole="user">
              <StudentResultDetail />
            </ProtectedRoute>
          }
        />

        {/* OTHER */}
        <Route path="/profile" element={<Profile />} />

        <Route path="/history" element={<History />} />

        <Route path="/waspas" element={<Waspas />} />

        <Route
          path="/result"
          element={
            <ProtectedRoute>
              <Result />
            </ProtectedRoute>
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
