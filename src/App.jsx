// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// APP.JSX — Routeur principal
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { Routes, Route, Navigate } from "react-router-dom";
import { useApp } from "./context/AppContext";
import LoginPage from "./pages/LoginPage";
import AdminPanel from "./pages/admin/AdminPanel";
import ClientRecueil from "./pages/client/ClientRecueil";
import LoadingScreen from "./components/layout/LoadingScreen";

export default function App() {
  const { ready, user } = useApp();

  if (!ready) return <LoadingScreen />;

  // Non authentifié → login
  if (!user) {
    return (
      <Routes>
        <Route path="/admin" element={<LoginPage mode="admin" />} />
        <Route path="/client/:slug?" element={<LoginPage mode="client" />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    );
  }

  // Authentifié → router selon le rôle
  if (user.role === "admin") {
    return (
      <Routes>
        <Route path="/admin/*" element={<AdminPanel />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    );
  }

  if (user.role === "client") {
    return (
      <Routes>
        <Route path="/client/*" element={<ClientRecueil />} />
        <Route path="*" element={<Navigate to="/client" replace />} />
      </Routes>
    );
  }

  return <Navigate to="/admin" replace />;
}
