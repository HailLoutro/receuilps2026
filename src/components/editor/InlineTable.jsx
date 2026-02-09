// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// INLINE TABLE — Tableau éditable réutilisable
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//
// Props :
//   columns     — Array de { key, label, type, minWidth, options }
//   rows        — Array de données
//   onUR        — (rowIdx, key, value) → update row
//   onAR        — () → add row  (null = pas d'ajout)
//   onDR        — (rowIdx) → delete row
//   onUC        — (colIdx, field, value) → update column (admin mode)
//   onAC        — () → add column (admin mode)
//   onDC        — (colIdx) → delete column (admin mode)
//   edit        — boolean (client peut modifier)
//   admin       — boolean (affiche les contrôles colonnes)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { Check, Plus, Trash2, X } from "lucide-react";
import { TABLE_COL_TYPES } from "../../config/constants";

export default function InlineTable({
  columns, rows,
  onUR, onAR, onDR,
  onUC, onAC, onDC,
  edit = true, admin = false,
}) {
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          {/* Header */}
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {columns.map((c, ci) => (
                <th key={c.key} className="text-left p-3 font-semibold text-slate-600" style={{ minWidth: c.minWidth || "130px" }}>
                  {admin ? (
                    <div className="flex items-center gap-1">
                      <input
                        value={c.label}
                        onChange={(e) => onUC(ci, "label", e.target.value)}
                        className="bg-transparent border-b border-dashed border-slate-300 focus:border-blue-500 focus:outline-none font-semibold text-slate-600 w-full text-sm"
                      />
                      <button onClick={() => onDC(ci)} className="text-slate-400 hover:text-rose-500 flex-shrink-0">
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    c.label
                  )}
                </th>
              ))}
              {(edit || admin) && (
                <th className="w-10 p-3">
                  {admin && (
                    <button onClick={onAC} className="w-6 h-6 rounded bg-violet-100 text-violet-600 hover:bg-violet-200 flex items-center justify-center">
                      <Plus size={12} />
                    </button>
                  )}
                </th>
              )}
            </tr>

            {/* Admin: column type selector row */}
            {admin && (
              <tr className="bg-slate-50/50 border-b border-slate-100">
                {columns.map((c, ci) => (
                  <td key={c.key} className="px-3 py-1">
                    <select
                      value={c.type || "text"}
                      onChange={(e) => onUC(ci, "type", e.target.value)}
                      className="text-xs bg-white border border-slate-200 rounded px-1.5 py-0.5 w-full"
                    >
                      {TABLE_COL_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                    {c.type === "select" && (
                      <input
                        value={c.options || ""}
                        onChange={(e) => onUC(ci, "options", e.target.value)}
                        placeholder="opt1, opt2..."
                        className="text-xs mt-1 bg-white border border-slate-200 rounded px-1.5 py-0.5 w-full"
                      />
                    )}
                  </td>
                ))}
                <td />
              </tr>
            )}
          </thead>

          {/* Body */}
          <tbody>
            {rows.map((row, ri) => (
              <tr key={row._id || ri} className={`border-b border-slate-100 ${ri % 2 ? "bg-slate-50/30" : ""} hover:bg-blue-50/20`}>
                {columns.map((c) => (
                  <td key={c.key} className="p-3">
                    {c.type === "check" ? (
                      <button
                        onClick={() => edit && onUR(ri, c.key, row[c.key] === "Oui" ? "Non" : "Oui")}
                        className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center mx-auto transition-all ${
                          row[c.key] === "Oui"
                            ? "bg-emerald-600 border-emerald-600 text-white"
                            : "bg-white border-slate-200"
                        }`}
                      >
                        {row[c.key] === "Oui" && <Check size={14} />}
                      </button>
                    ) : c.type === "select" ? (
                      <select
                        value={row[c.key] || ""}
                        onChange={(e) => onUR(ri, c.key, e.target.value)}
                        disabled={!edit}
                        className="bg-white border border-slate-200 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 w-full"
                      >
                        <option value="">—</option>
                        {(c.options || "").split(",").map((o) => o.trim()).filter(Boolean).map((o) => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        value={row[c.key] || ""}
                        onChange={(e) => onUR(ri, c.key, e.target.value)}
                        disabled={!edit}
                        className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none px-0.5 py-0.5 text-sm disabled:opacity-60"
                      />
                    )}
                  </td>
                ))}
                {edit && (
                  <td className="p-3">
                    <button onClick={() => onDR(ri)} className="text-slate-400 hover:text-rose-500">
                      <Trash2 size={14} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add row button */}
      {edit && onAR && (
        <div className="p-3 border-t border-slate-100">
          <button onClick={onAR} className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg">
            <Plus size={14} /> Ajouter une ligne
          </button>
        </div>
      )}
    </div>
  );
}
