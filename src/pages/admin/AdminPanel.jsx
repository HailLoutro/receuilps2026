// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ADMIN PANEL — Shell avec sidebar + sous-pages
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { useState } from "react";
import { Users, Pencil, Lock, Eye, Layers, LogOut, CheckCircle2, Clock } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { BRAND } from "../../config/constants";
import AdminClients from "./AdminClients";
import AdminTemplate from "./AdminTemplate";
import AdminAdmins from "./AdminAdmins";
import AdminClientView from "./AdminClientView";

const NAV = [
  { id: "clients",  label: "Clients",             icon: Users },
  { id: "template", label: "Éditeur de template", icon: Pencil },
  { id: "admins",   label: "Administrateurs",     icon: Lock },
];

export default function AdminPanel() {
  const { logout, clients, saving } = useApp();
  const [view, setView] = useState("clients");
  const [viewClient, setViewClient] = useState(null);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-900 text-white flex flex-col flex-shrink-0">
        <div className="p-5 flex items-center gap-3 border-b border-white/10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center">
            <Layers size={18} />
          </div>
          <div>
            <div className="font-bold text-sm">{BRAND.name}</div>
            <div className="text-xs text-blue-300">Administration</div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => { setView(n.id); setViewClient(null); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                view === n.id && !viewClient
                  ? "bg-white/15 font-semibold"
                  : "text-blue-200/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <n.icon size={18} /> {n.label}
            </button>
          ))}

          {/* Client responses shortcuts */}
          {clients.length > 0 && (
            <>
              <div className="pt-4 pb-1 px-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400/50">
                  Voir réponses
                </span>
              </div>
              {clients.map((c) => (
                <button
                  key={c.id}
                  onClick={() => { setView("client-view"); setViewClient(c); }}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm transition-all ${
                    viewClient?.id === c.id
                      ? "bg-white/15 font-semibold"
                      : "text-blue-200/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Eye size={14} />
                  <span className="truncate">{c.name}</span>
                </button>
              ))}
            </>
          )}
        </nav>

        <div className="p-4 border-t border-white/10 flex items-center justify-between">
          <div className="text-xs text-blue-300/70">
            {saving ? (
              <span className="flex items-center gap-1"><Clock size={10} className="animate-spin" /> Sauvegarde...</span>
            ) : (
              <span className="flex items-center gap-1"><CheckCircle2 size={10} className="text-emerald-400" /> OK</span>
            )}
          </div>
          <button onClick={logout} className="text-blue-300/60 hover:text-white">
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-[1200px] mx-auto">
          {view === "clients"    && !viewClient && <AdminClients />}
          {view === "template"   && <AdminTemplate />}
          {view === "admins"     && <AdminAdmins />}
          {view === "client-view" && viewClient && (
            <AdminClientView
              client={viewClient}
              onBack={() => { setView("clients"); setViewClient(null); }}
            />
          )}
        </div>
      </main>
    </div>
  );
}
