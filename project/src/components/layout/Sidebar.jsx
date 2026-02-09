import { Layers, CheckCircle2, Clock } from "lucide-react";
import { useApp } from "../../context/AppContext";
import SECTIONS from "../../config/sections";
import { BRAND } from "../../config/options";

export default function Sidebar() {
  const { section, setSection, sidebarOpen, progress, totalProgress, saving } = useApp();

  return (
    <aside className={`${sidebarOpen ? "w-72" : "w-0 md:w-16"} flex flex-col transition-all duration-300 overflow-hidden flex-shrink-0`} style={{ background: BRAND.colors.primary }}>
      {/* Logo */}
      <div className="p-4 flex items-center gap-3 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center flex-shrink-0">
          <Layers size={18} className="text-white" />
        </div>
        {sidebarOpen && (
          <div className="min-w-0">
            <div className="font-bold text-sm tracking-wide text-white">{BRAND.name}</div>
            <div className="text-xs text-blue-300 truncate">{BRAND.subtitle}</div>
          </div>
        )}
      </div>

      {/* Progress */}
      {sidebarOpen && (
        <div className="px-4 py-3 border-b border-white/10">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-blue-300">Progression</span>
            <span className="text-white font-bold">{totalProgress}%</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-400 to-violet-400 rounded-full transition-all duration-700" style={{ width: `${totalProgress}%` }} />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 px-2">
        {SECTIONS.map((s, i) => {
          const isActive = section === s.id;
          const showGroup = s.group !== SECTIONS[i - 1]?.group;
          const val = s.dataKey ? (progress[s.dataKey] ?? progress[s.id] ?? 0) : null;

          return (
            <div key={s.id}>
              {showGroup && sidebarOpen && (
                <div className="px-3 pt-4 pb-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400/60">{s.group}</span>
                </div>
              )}
              <button
                onClick={() => setSection(s.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all mb-0.5 ${isActive ? "bg-white/15 text-white font-semibold" : "text-blue-200/70 hover:bg-white/5 hover:text-white"}`}
              >
                <s.icon size={18} className="flex-shrink-0" />
                {sidebarOpen && (
                  <>
                    <span className="truncate flex-1 text-left">{s.label}</span>
                    {val !== null && (
                      <span className={`text-[10px] font-bold ${val >= 70 ? "text-emerald-400" : "text-blue-400/60"}`}>{val}%</span>
                    )}
                  </>
                )}
              </button>
            </div>
          );
        })}
      </nav>

      {/* Status */}
      {sidebarOpen && (
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-2 text-xs text-blue-300/70">
            {saving ? <Clock size={12} className="animate-spin" /> : <CheckCircle2 size={12} className="text-emerald-400" />}
            <span>{saving ? "Sauvegarde..." : "Sauvegardé"}</span>
          </div>
        </div>
      )}
    </aside>
  );
}
