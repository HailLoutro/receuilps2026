import { ChevronLeft, Menu, Clock } from "lucide-react";
import { useApp } from "../../context/AppContext";
import SECTIONS from "../../config/sections";

export default function TopBar() {
  const { section, sidebarOpen, setSidebarOpen, saving } = useApp();
  const current = SECTIONS.find(s => s.id === section);

  return (
    <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors">
          {sidebarOpen ? <ChevronLeft size={18} className="text-slate-500" /> : <Menu size={18} className="text-slate-500" />}
        </button>
        <div className="h-5 w-px bg-slate-200" />
        <h2 className="font-semibold text-slate-800 text-sm">{current?.label || "Accueil"}</h2>
      </div>
      <div className="flex items-center gap-3">
        {saving && <span className="text-xs text-slate-400 flex items-center gap-1"><Clock size={12} className="animate-spin" /> Sauvegarde...</span>}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          Auto-save actif
        </div>
      </div>
    </div>
  );
}
