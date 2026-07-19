import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Alerts from "./pages/Alerts";
import Incidents from "./pages/Incidents";
import Devices from "./pages/Devices";
import Rules from "./pages/Rules";

function Protected({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <Protected>
            <Dashboard />
          </Protected>
        }
      />
      <Route
        path="/alerts"
        element={
          <Protected>
            <Alerts />
          </Protected>
        }
      />
      <Route
        path="/incidents"
        element={
          <Protected>
            <Incidents />
          </Protected>
        }
      />
      <Route
        path="/devices"
        element={
          <Protected>
            <Devices />
          </Protected>
        }
      />
      <Route
        path="/rules"
        element={
          <Protected>
            <Rules />
          </Protected>
        }
      />
    </Routes>
  );
}
