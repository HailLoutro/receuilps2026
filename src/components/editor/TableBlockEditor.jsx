// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TABLE BLOCK EDITOR — Config colonnes + données par défaut
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { Inp } from "../ui";
import InlineTable from "./InlineTable";
import { uid } from "../../config/constants";

export default function TableBlockEditor({ content, onChange }) {
  const c = content || {
    title: "", columns: [], defaultRows: [],
    allowAddRows: true, allowAddCols: false,
  };

  const update = (field, value) => onChange({ ...c, [field]: value });

  // ── Column operations ──────────────────────────────────────

  const addCol = () => {
    const key = `col_${uid("c")}`;
    update("columns", [
      ...(c.columns || []),
      { key, label: "Nouvelle colonne", type: "text", minWidth: "140px", options: "" },
    ]);
  };

  const updateCol = (ci, field, val) => {
    const cols = [...(c.columns || [])];
    cols[ci] = { ...cols[ci], [field]: val };
    update("columns", cols);
  };

  const deleteCol = (ci) => {
    update("columns", (c.columns || []).filter((_, i) => i !== ci));
  };

  // ── Row operations ─────────────────────────────────────────

  const addRow = () => {
    const row = { _id: uid("row") };
    (c.columns || []).forEach((col) => { row[col.key] = ""; });
    update("defaultRows", [...(c.defaultRows || []), row]);
  };

  const updateRow = (ri, key, val) => {
    const rows = [...(c.defaultRows || [])];
    rows[ri] = { ...rows[ri], [key]: val };
    update("defaultRows", rows);
  };

  const deleteRow = (ri) => {
    update("defaultRows", (c.defaultRows || []).filter((_, i) => i !== ri));
  };

  // ── Render ─────────────────────────────────────────────────

  return (
    <div className="space-y-4">
      <Inp label="Titre du tableau" value={c.title} onChange={(v) => update("title", v)} placeholder="ex: Formulaires standards" />

      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={c.allowAddRows !== false}
            onChange={(e) => update("allowAddRows", e.target.checked)}
            className="rounded"
          />
          Client peut ajouter des lignes
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={c.allowAddCols === true}
            onChange={(e) => update("allowAddCols", e.target.checked)}
            className="rounded"
          />
          Client peut ajouter des colonnes
        </label>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Colonnes & données par défaut
        </label>
        <InlineTable
          columns={c.columns || []}
          rows={c.defaultRows || []}
          onUR={updateRow}
          onAR={addRow}
          onDR={deleteRow}
          onUC={updateCol}
          onAC={addCol}
          onDC={deleteCol}
          admin
          edit
        />
      </div>
    </div>
  );
}
