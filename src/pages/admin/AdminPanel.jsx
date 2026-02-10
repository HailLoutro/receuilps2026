// ━━━ ADMIN PANEL ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
import { useState } from "react";
import {
  Layers, Users, Pencil, Download, Archive, Lock, LogOut,
  Clock, CheckCircle2,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { BRAND } from "../../config/constants";
import AdminClients from "./AdminClients";
import AdminTemplate from "./AdminTemplate";
import AdminExport from "./AdminExport";
import AdminBackups from "./AdminBackups";
import AdminAdmins from "./AdminAdmins";

const NAV = [
  { id: "clients", label: "Clients", icon: Users },
  { id: "template", label: "Éditeur de template", icon: Pencil },
  { id: "export", label: "Export recueils", icon: Download },
  { id: "backups", label: "Sauvegardes", icon: Archive },
  { id: "admins", label: "Administrateurs", icon: Lock },
];

export default function AdminPanel() {
  const { logout, saving, clients, template, templateRoles } = useApp();
  const [view, setView] = useState("clients");

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", background: "#f1f5f9" }}>
      <link href={BRAND.font} rel="stylesheet" />

      <aside className="w-60 bg-[#0a0e3a] text-white flex flex-col flex-shrink-0">
        <div className="p-5 flex items-center gap-3 border-b border-white/10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center"><Layers size={18} /></div>
          <div><div className="font-bold text-sm">{BRAND.name}</div><div className="text-xs text-blue-300">Administration</div></div>
        </div>

        <div className="px-5 py-3 border-b border-white/10 space-y-1">
          <div className="flex justify-between text-xs"><span className="text-blue-300/70">Clients</span><span className="text-white font-bold">{clients.length}</span></div>
          <div className="flex justify-between text-xs"><span className="text-blue-300/70">Pages template</span><span className="text-white font-bold">{template.pages?.length || 0}</span></div>
          <div className="flex justify-between text-xs"><span className="text-blue-300/70">Rôles standards</span><span className="text-white font-bold">{templateRoles.length}</span></div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(n => (
            <button key={n.id} onClick={() => setView(n.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all ${view === n.id ? "bg-white/15 font-semibold text-white" : "text-blue-200/70 hover:bg-white/5 hover:text-white"}`}>
              <n.icon size={16} /> {n.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 flex items-center justify-between">
          <div className="text-xs text-blue-300/70">
            {saving
              ? <span className="flex items-center gap-1"><Clock size={10} className="animate-spin" /> Sauvegarde...</span>
              : <span className="flex items-center gap-1"><CheckCircle2 size={10} className="text-emerald-400" /> Sauvegardé</span>}
          </div>
          <button onClick={() => { if (confirm("Se déconnecter ?")) logout(); }} className="text-blue-300/60 hover:text-white"><LogOut size={16} /></button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-[1400px] mx-auto">
          {view === "clients" && <AdminClients />}
          {view === "template" && <AdminTemplate />}
          {view === "export" && <AdminExport />}
          {view === "backups" && <AdminBackups />}
          {view === "admins" && <AdminAdmins />}
        </div>
      </main>
    </div>
  );
}
