// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// APP.JSX — Shell principal
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { AppProvider, useApp } from "./context/AppContext";
import { BRAND } from "./config/options";
import Sidebar from "./components/layout/Sidebar";
import TopBar from "./components/layout/TopBar";
import SECTION_COMPONENTS from "./sections";

function AppContent() {
  const { section } = useApp();
  const SectionComponent = SECTION_COMPONENTS[section] || SECTION_COMPONENTS.accueil;

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: BRAND.font, background: "#f1f5f9" }}>
      <link href={BRAND.fontUrl} rel="stylesheet" />
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <TopBar />
        <div className="p-6 md:p-8 max-w-[1400px] mx-auto">
          <SectionComponent />
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
