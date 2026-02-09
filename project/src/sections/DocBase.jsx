import { Plus, Trash2 } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { SectionHeader, Select } from "../ui";
import { YES_NO } from "../../config/options";

export default function DocBase() {
  const { docBase, setDocBase } = useApp();

  const addPop = () => setDocBase({ ...docBase, populations: [...docBase.populations, { name: "", folder: "" }] });
  const updatePop = (i, field, val) => {
    const p = [...docBase.populations];
    p[i] = { ...p[i], [field]: val };
    setDocBase({ ...docBase, populations: p });
  };
  const removePop = (i) => setDocBase({ ...docBase, populations: docBase.populations.filter((_, j) => j !== i) });

  return (
    <div className="space-y-6">
      <SectionHeader title="7. Base documentaire" subtitle="Configurez votre base documentaire pour les collaborateurs" />

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Souhaitez-vous stocker des documents sur PeopleSpheres ?</label>
            <Select value={docBase.store} onChange={v => setDocBase({ ...docBase, store: v })} options={YES_NO} className="w-full" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Base documentaire commune à tous les collaborateurs ?</label>
            <Select value={docBase.common} onChange={v => setDocBase({ ...docBase, common: v })} options={YES_NO} className="w-full" />
          </div>
        </div>

        {docBase.common === "Non" && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-slate-700">Populations et répertoires</label>
              <button onClick={addPop} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"><Plus size={14} /> Ajouter</button>
            </div>
            <div className="space-y-3">
              {docBase.populations.map((p, i) => (
                <div key={i} className="flex gap-3 items-center p-3 bg-slate-50 rounded-lg">
                  <input value={p.name} onChange={e => updatePop(i, "name", e.target.value)} className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Population (ex: France)" />
                  <input value={p.folder} onChange={e => updatePop(i, "folder", e.target.value)} className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Nom du répertoire SharePoint" />
                  <button onClick={() => removePop(i)} className="text-slate-400 hover:text-rose-500"><Trash2 size={15} /></button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
