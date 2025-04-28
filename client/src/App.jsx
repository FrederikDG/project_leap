import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import ProtectedLayout from "./components/ProtectedLayout";
import Overview from "./pages/Overview";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  return (
    <Routes>
      {/* public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* protected wrapper at “/” */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <ProtectedLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="overview" replace />} />

        <Route path="overview" element={<Overview />} />
        <Route path="dashboard/:campaignSlug" element={<Dashboard />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
