import { Check, Plus, Trash2 } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { SectionHeader, InlineInput } from "../ui";
import { TEMPLATE_PREVIEWS } from "../../config/defaults";

function TemplateCard({ t, selected, onSelect }) {
  return (
    <button onClick={() => onSelect(t.id)} className={`relative rounded-xl border-2 p-1 transition-all text-left ${selected ? "border-blue-600 shadow-lg shadow-blue-100 scale-[1.02]" : "border-slate-200 hover:border-blue-300 hover:shadow-md"}`}>
      {selected && <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center z-10"><Check size={14} /></div>}
      <div className="rounded-lg bg-slate-50 p-3 aspect-[16/10] flex flex-col gap-1.5">
        <div className={`rounded bg-gradient-to-r from-[#1a1f6c] to-[#4e54c8] w-full ${t.blocks.includes("banner-xl") ? "h-8" : t.blocks.includes("banner-wide") ? "h-7" : "h-5"}`} />
        {t.blocks.includes("shortcuts") && <div className="flex gap-1">{[1,2,3].map(n => <div key={n} className="flex-1 h-3 rounded bg-blue-200" />)}</div>}
        {t.blocks.includes("video") && <div className="h-8 rounded bg-slate-200 flex items-center justify-center"><div className="w-4 h-4 rounded-full bg-slate-300" /></div>}
        {t.blocks.includes("shortcuts2") && <div className="flex gap-1">{[1,2].map(n => <div key={n} className="flex-1 h-3 rounded bg-violet-200" />)}</div>}
        {t.blocks.includes("image") && <div className="h-4 rounded bg-slate-200" />}
        {t.blocks.includes("image2") && <div className="h-4 rounded bg-slate-200" />}
      </div>
      <div className="p-2">
        <div className="font-semibold text-xs text-slate-800">{t.name}</div>
        <div className="text-xs text-slate-500 mt-0.5">{t.desc}</div>
      </div>
    </button>
  );
}

export default function Widgets() {
  const { selectedTemplate, setSelectedTemplate, templateData, setTemplateData } = useApp();

  const addShortcut = () => setTemplateData({ ...templateData, shortcuts: [...templateData.shortcuts, { title: "", desc: "", link: "" }] });
  const updateShortcut = (i, field, val) => {
    const s = [...templateData.shortcuts];
    s[i] = { ...s[i], [field]: val };
    setTemplateData({ ...templateData, shortcuts: s });
  };
  const removeShortcut = (i) => setTemplateData({ ...templateData, shortcuts: templateData.shortcuts.filter((_, j) => j !== i) });

  return (
    <div className="space-y-6">
      <SectionHeader title="6. Page d'accueil & Widgets" subtitle="Choisissez un template et personnalisez votre page d'accueil" />

      {/* Template selector */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4">Choisir un template</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {TEMPLATE_PREVIEWS.map(t => (
            <TemplateCard key={t.id} t={t} selected={selectedTemplate === t.id} onSelect={setSelectedTemplate} />
          ))}
        </div>
      </div>

      {/* Customization */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
        <h3 className="font-bold text-slate-800">Personnalisation du Template {selectedTemplate}</h3>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Arrière-plan (lien image ou couleur CSS)</label>
          <input value={templateData.background} onChange={e => setTemplateData({ ...templateData, background: e.target.value })} className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm" placeholder="https://... ou #1a1f6c" />
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-slate-700">Raccourcis / Accès rapides</label>
            <button onClick={addShortcut} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"><Plus size={14} /> Ajouter</button>
          </div>
          <div className="space-y-3">
            {templateData.shortcuts.map((s, i) => (
              <div key={i} className="flex gap-3 items-start p-3 bg-slate-50 rounded-lg">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input value={s.title} onChange={e => updateShortcut(i, "title", e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Titre" />
                  <input value={s.desc} onChange={e => updateShortcut(i, "desc", e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Description" />
                  <input value={s.link} onChange={e => updateShortcut(i, "link", e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Lien" />
                </div>
                <button onClick={() => removeShortcut(i)} className="text-slate-400 hover:text-rose-500 mt-2"><Trash2 size={15} /></button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Lien de la vidéo</label>
            <input value={templateData.videoLink} onChange={e => setTemplateData({ ...templateData, videoLink: e.target.value })} className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="https://youtube.com/..." />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Lien de l'image</label>
            <input value={templateData.imageLink} onChange={e => setTemplateData({ ...templateData, imageLink: e.target.value })} className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="https://..." />
          </div>
        </div>
      </div>
    </div>
  );
}
