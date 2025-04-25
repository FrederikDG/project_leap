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
        {/* if someone hits “/” → redirect to “/overview” */}
        <Route index element={<Navigate to="overview" replace />} />

        {/* these become “/overview” and “/dashboard” */}
        <Route path="overview" element={<Overview />} />
        <Route path="dashboard" element={<Dashboard />} />

        {/* add more private pages here */}
      </Route>

      {/* catch‐all → send back to login or a 404 page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
