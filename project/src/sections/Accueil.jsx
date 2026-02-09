import { BookOpen, Users, CheckCircle2, Save, ChevronRight } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { ProgressBar, InfoBox } from "../ui";
import SECTIONS from "../../config/sections";

export default function Accueil() {
  const { progress, totalProgress, saving, lastSaved, setSection } = useApp();

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1f6c] via-[#2d3494] to-[#4e54c8] p-8 md:p-12 text-white">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "60px 60px, 40px 40px" }} />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <BookOpen size={20} />
            </div>
            <span className="text-blue-200 font-medium text-sm tracking-wide uppercase">Recueil du besoin</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">Bienvenue sur votre espace<br />de configuration Core RH</h1>
          <p className="text-blue-100 max-w-2xl text-base leading-relaxed">
            Ce document a pour but de recueillir vos besoins concernant le Core RH de votre futur SIRH.
            Il servira de base pour configurer l'outil de la manière la plus adaptée à votre organisation et à vos processus.
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center"><Users size={18} className="text-blue-600" /></div>
            <span className="font-semibold text-slate-800 text-sm">Progression globale</span>
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-2">{totalProgress}%</div>
          <ProgressBar value={totalProgress} />
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center"><CheckCircle2 size={18} className="text-emerald-600" /></div>
            <span className="font-semibold text-slate-800 text-sm">Sections complétées</span>
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-2">{Object.values(progress).filter(v => v >= 70).length} / {Object.keys(progress).length}</div>
          <p className="text-xs text-slate-500">sections à 70%+ de complétion</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-violet-100 flex items-center justify-center"><Save size={18} className="text-violet-600" /></div>
            <span className="font-semibold text-slate-800 text-sm">Sauvegarde</span>
          </div>
          <div className="text-sm font-bold text-slate-900 mb-1">{saving ? "Sauvegarde en cours..." : lastSaved ? `Sauvegardé à ${lastSaved.toLocaleTimeString("fr-FR")}` : "Sauvegarde automatique"}</div>
          <p className="text-xs text-slate-500">Les données sont sauvegardées automatiquement</p>
        </div>
      </div>

      {/* Section progress */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4">Avancement par section</h3>
        <div className="space-y-3">
          {SECTIONS.filter(s => s.id !== "accueil").map(s => {
            const val = progress[s.dataKey] ?? progress[s.id] ?? 0;
            return (
              <button key={s.id} onClick={() => setSection(s.id)} className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors text-left group">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${val >= 70 ? "bg-emerald-100" : "bg-slate-100"}`}>
                  <s.icon size={16} className={val >= 70 ? "text-emerald-600" : "text-slate-500"} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600 transition-colors">{s.label}</span>
                    <span className="text-xs text-slate-500">{val}%</span>
                  </div>
                  <ProgressBar value={val} size="sm" />
                </div>
                <ChevronRight size={16} className="text-slate-400 group-hover:text-blue-500" />
              </button>
            );
          })}
        </div>
      </div>

      <InfoBox type="tip">
        <strong>Conseil :</strong> Nous vous conseillons de réaliser ce recueil en plusieurs fois afin de vous laisser le temps de projeter vos processus et situations RH.
        Pour vous aider, appuyez-vous sur votre consultant Socle PeopleSpheres, le centre de support, et le parcours eLearning dans votre espace PeopleSpheres Academy.
      </InfoBox>
    </div>
  );
}
