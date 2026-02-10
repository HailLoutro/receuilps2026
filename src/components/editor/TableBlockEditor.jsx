// ━━━ TABLE BLOCK EDITOR ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
import { Inp } from "../ui";
import InlineTable from "./InlineTable";
import { uid } from "../../config/constants";

export default function TableBlockEditor({ content, onChange }) {
  const c = content || { title: "", columns: [], defaultRows: [], allowAddRows: true, allowAddCols: false };
  const up = (f, v) => onChange({ ...c, [f]: v });

  const addC = () => up("columns", [...(c.columns || []), { key: `c_${uid()}`, label: "Nouvelle col.", type: "text", minWidth: "140px", options: "" }]);
  const upC = (i, f, v) => { const cols = [...(c.columns || [])]; cols[i] = { ...cols[i], [f]: v }; up("columns", cols); };
  const delC = i => up("columns", (c.columns || []).filter((_, j) => j !== i));
  const addR = () => { const r = { _id: uid("r") }; (c.columns || []).forEach(col => { r[col.key] = ""; }); up("defaultRows", [...(c.defaultRows || []), r]); };
  const upR = (i, k, v) => { const rows = [...(c.defaultRows || [])]; rows[i] = { ...rows[i], [k]: v }; up("defaultRows", rows); };
  const delR = i => up("defaultRows", (c.defaultRows || []).filter((_, j) => j !== i));

  return (
    <div className="space-y-4">
      <Inp label="Titre du tableau" value={c.title} onChange={v => up("title", v)} ph="ex: Formulaires standards" />
      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={c.allowAddRows !== false} onChange={e => up("allowAddRows", e.target.checked)} className="rounded" /> Client : ajouter lignes
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={c.allowAddCols === true} onChange={e => up("allowAddCols", e.target.checked)} className="rounded" /> Client : ajouter colonnes
        </label>
      </div>

      {/* ── Propagation des rôles ──────────────────────────────── */}
      <div className="border border-indigo-200 bg-indigo-50/50 rounded-xl p-3 space-y-2">
        <div className="text-xs font-bold text-indigo-700 uppercase tracking-wide">Propagation des rôles</div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={!!c.roleSource} onChange={e => up("roleSource", e.target.checked)} className="rounded accent-indigo-600" />
          <span>🔑 <strong>Source des rôles</strong> — la colonne "name" fournit les rôles</span>
        </label>
        <div className="flex items-center gap-2 text-sm">
          <span>🔗 Colonnes auto :</span>
          <select value={c.roleCols || ""} onChange={e => up("roleCols", e.target.value || undefined)}
            className="text-xs bg-white border border-indigo-200 rounded px-2 py-1">
            <option value="">Aucune</option>
            <option value="check">check (✓/✗ par rôle)</option>
            <option value="select:Modifier|Voir|Masquer">select (Modifier/Voir/Masquer)</option>
            <option value="select:Oui|Non">select (Oui/Non)</option>
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={!!c.roleOptions} onChange={e => up("roleOptions", e.target.checked)} className="rounded accent-indigo-600" />
          <span>📋 <strong>Options = rôles</strong> — les selects de ce tableau incluent les noms de rôles</span>
        </label>
      </div>

      <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded-lg">
        💡 Dans les cellules texte, le client peut taper Entrée pour séparer le texte principal d'un sous-texte affiché en italique.
      </div>
      <InlineTable columns={c.columns || []} rows={c.defaultRows || []} onUR={upR} onAR={addR} onDR={delR} onUC={upC} onAC={addC} onDC={delC} admin edit />
    </div>
  );
}
