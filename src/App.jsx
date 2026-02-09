// ━━━ APP ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import LoadingScreen from "./components/layout/LoadingScreen";
import LoginPage from "./pages/LoginPage";
import AdminPanel from "./pages/admin/AdminPanel";
import ClientRecueil from "./pages/client/ClientRecueil";

function ProtectedAdmin({ children }) {
  const { ready, user } = useApp();
  if (!ready) return <LoadingScreen />;
  if (!user || user.type !== "admin") return <Navigate to="/admin/login" />;
  return children;
}

function ProtectedClient({ children }) {
  const { ready, user } = useApp();
  if (!ready) return <LoadingScreen />;
  if (!user || user.type !== "client") return <Navigate to="/client" />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Admin */}
      <Route path="/admin/login" element={<LoginPage mode="admin" />} />
      <Route path="/admin" element={<ProtectedAdmin><AdminPanel /></ProtectedAdmin>} />

      {/* Client */}
      <Route path="/client" element={<LoginPage mode="client" />} />
      <Route path="/client/:slug" element={<LoginPage mode="client" />} />
      <Route path="/client/app" element={<ProtectedClient><ClientRecueil /></ProtectedClient>} />

      {/* Default */}
      <Route path="*" element={<Navigate to="/admin/login" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}
