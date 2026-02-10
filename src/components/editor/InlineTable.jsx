// ━━━ INLINE TABLE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FIX #3 : colonnes figées (sticky) — les 2 premières colonnes restent visibles au scroll horizontal
import { Check, Plus, Trash2, X } from "lucide-react";
import { COL_TYPES } from "../../config/constants";
import CellDisplay from "./CellDisplay";

// Styles sticky pour les 2 premières colonnes
const stickyClass = (ci) => {
  if (ci === 0) return "sticky left-0 z-10";
  if (ci === 1) return "sticky left-[160px] z-10";
  return "";
};
const stickyBg = (isEven) => isEven ? "bg-white" : "bg-slate-50/80";
const stickyHeadBg = "bg-slate-50";

export default function InlineTable({
  columns, rows,
  onUR, onAR, onDR,
  onUC, onAC, onDC,
  edit = true, admin = false,
  stickyCount = 2,
}) {
  // Calcule left pour chaque colonne sticky
  const getLeft = (ci) => {
    if (ci === 0) return "0px";
    // Somme des minWidth des colonnes précédentes
    let left = 0;
    for (let i = 0; i < ci && i < stickyCount; i++) {
      left += parseInt(columns[i]?.minWidth || "140", 10);
    }
    return `${left}px`;
  };

  const isSticky = (ci) => ci < stickyCount && columns.length > 3;
  const stickyStyle = (ci) => isSticky(ci) ? { position: "sticky", left: getLeft(ci), zIndex: 10 } : {};
  const shadowClass = (ci) => (isSticky(ci) && ci === stickyCount - 1) ? "shadow-[2px_0_4px_-2px_rgba(0,0,0,0.08)]" : "";

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {columns.map((c, ci) => (
                <th key={c.key}
                  className={`text-left p-3 font-semibold text-slate-600 bg-slate-50 ${shadowClass(ci)}`}
                  style={{ minWidth: c.minWidth || "130px", ...stickyStyle(ci) }}>
                  {admin ? (
                    <div className="flex items-center gap-1">
                      <input value={c.label} onChange={e => onUC(ci, "label", e.target.value)}
                        className="bg-transparent border-b border-dashed border-slate-300 focus:border-blue-500 focus:outline-none font-semibold text-slate-600 w-full text-sm" />
                      <button onClick={() => onDC(ci)} className="text-slate-400 hover:text-rose-500 flex-shrink-0"><X size={12} /></button>
                    </div>
                  ) : c.label}
                </th>
              ))}
              {(edit || admin) && (
                <th className="w-10 p-3 bg-slate-50">
                  {admin && <button onClick={onAC} className="w-6 h-6 rounded bg-violet-100 text-violet-600 hover:bg-violet-200 flex items-center justify-center"><Plus size={12} /></button>}
                </th>
              )}
            </tr>
            {admin && (
              <tr className="bg-slate-50/50 border-b border-slate-100">
                {columns.map((c, ci) => (
                  <td key={c.key} className={`px-3 py-1 bg-slate-50/50 ${shadowClass(ci)}`} style={stickyStyle(ci)}>
                    <select value={c.type || "text"} onChange={e => onUC(ci, "type", e.target.value)}
                      className="text-xs bg-white border border-slate-200 rounded px-1.5 py-0.5 w-full">
                      {COL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    {c.type === "select" && (
                      <input value={c.options || ""} onChange={e => onUC(ci, "options", e.target.value)}
                        placeholder="opt1, opt2..." className="text-xs mt-1 bg-white border border-slate-200 rounded px-1.5 py-0.5 w-full" />
                    )}
                  </td>
                ))}
                <td />
              </tr>
            )}
          </thead>
          <tbody>
            {rows.map((row, ri) => {
              const isEven = ri % 2 === 0;
              const rowBg = isEven ? "bg-white" : "bg-slate-50/30";
              const cellBg = isEven ? "bg-white" : "bg-[#fafbfc]";
              return (
                <tr key={row._id || ri} className={`border-b border-slate-100 ${rowBg} hover:bg-blue-50/20`}>
                  {columns.map((c, ci) => (
                    <td key={c.key}
                      className={`p-3 ${isSticky(ci) ? cellBg : ""} ${shadowClass(ci)}`}
                      style={stickyStyle(ci)}>
                      {c.type === "check" ? (
                        <button
                          onClick={() => edit && onUR(ri, c.key, row[c.key] === "Oui" ? "Non" : "Oui")}
                          className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center mx-auto transition-all ${
                            row[c.key] === "Oui" ? "bg-emerald-600 border-emerald-600 text-white" : "bg-white border-slate-200"
                          }`}>
                          {row[c.key] === "Oui" && <Check size={14} />}
                        </button>
                      ) : c.type === "select" ? (
                        <select value={row[c.key] || ""} onChange={e => onUR(ri, c.key, e.target.value)} disabled={!edit}
                          className="bg-white border border-slate-200 rounded-md px-2 py-1.5 text-sm w-full focus:outline-none focus:ring-1 focus:ring-blue-400">
                          <option value="">—</option>
                          {(c.options || "").split(",").map(o => o.trim()).filter(Boolean).map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      ) : edit ? (
                        <textarea
                          value={row[c.key] || ""} onChange={e => onUR(ri, c.key, e.target.value)}
                          rows={1}
                          className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none px-0.5 py-0.5 text-sm resize-none"
                          onInput={e => { e.target.style.height = "auto"; e.target.style.height = e.target.scrollHeight + "px"; }}
                          placeholder={"Texte\n↵ sous-texte"}
                        />
                      ) : (
                        <CellDisplay value={row[c.key]} />
                      )}
                    </td>
                  ))}
                  {edit && (
                    <td className="p-3">
                      <button onClick={() => onDR(ri)} className="text-slate-400 hover:text-rose-500"><Trash2 size={14} /></button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
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
