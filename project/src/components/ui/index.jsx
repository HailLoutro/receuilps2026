// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// UI Components — Bibliothèque de composants réutilisables
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { Check, Eye, Plus, Trash2 } from "lucide-react";

// ── Select ──────────────────────────────────────────────────────
export function Select({ value, onChange, options, className = "", placeholder = "—" }) {
  return (
    <select
      value={value || ""}
      onChange={e => onChange(e.target.value)}
      className={`bg-white border border-slate-200 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-shadow ${className}`}
    >
      <option value="">{placeholder}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

// ── Badge ────────────────────────────────────────────────────────
const BADGE_COLORS = {
  blue: "bg-blue-50 text-blue-700 border-blue-200",
  green: "bg-emerald-50 text-emerald-700 border-emerald-200",
  orange: "bg-amber-50 text-amber-700 border-amber-200",
  red: "bg-rose-50 text-rose-700 border-rose-200",
  gray: "bg-slate-50 text-slate-600 border-slate-200",
  purple: "bg-violet-50 text-violet-700 border-violet-200",
};

export function Badge({ children, color = "blue" }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${BADGE_COLORS[color]}`}>
      {children}
    </span>
  );
}

// ── ProgressBar ─────────────────────────────────────────────────
export function ProgressBar({ value, size = "md" }) {
  const h = size === "sm" ? "h-1.5" : "h-2.5";
  const color = value === 100 ? "bg-emerald-500" : value > 50 ? "bg-blue-500" : "bg-amber-500";
  return (
    <div className={`w-full bg-slate-100 rounded-full ${h} overflow-hidden`}>
      <div className={`${h} rounded-full ${color} transition-all duration-700 ease-out`} style={{ width: `${value}%` }} />
    </div>
  );
}

// ── InfoBox ─────────────────────────────────────────────────────
const INFO_STYLES = {
  info: "bg-blue-50 border-blue-200 text-blue-800",
  tip: "bg-emerald-50 border-emerald-200 text-emerald-800",
  warning: "bg-amber-50 border-amber-200 text-amber-800",
};

export function InfoBox({ children, type = "info" }) {
  return <div className={`p-4 rounded-xl border text-sm leading-relaxed ${INFO_STYLES[type]}`}>{children}</div>;
}

// ── SectionHeader ───────────────────────────────────────────────
export function SectionHeader({ title, subtitle }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
      {subtitle && <p className="text-slate-500 mt-1">{subtitle}</p>}
    </div>
  );
}

// ── InlineInput ─────────────────────────────────────────────────
export function InlineInput({ value, onChange, placeholder = "", className = "", disabled = false }) {
  return (
    <input
      value={value || ""}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
      placeholder={placeholder}
      className={`w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none px-1 py-0.5 text-sm transition-colors disabled:opacity-40 ${className}`}
    />
  );
}

// ── Checkbox toggle ─────────────────────────────────────────────
export function CheckToggle({ checked, onChange, size = "md", color = "blue" }) {
  const s = size === "sm" ? "w-6 h-6" : "w-7 h-7";
  const ic = size === "sm" ? 12 : 14;
  const bg = color === "green" ? "bg-emerald-600 border-emerald-600" : "bg-blue-600 border-blue-600";
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`${s} rounded-lg border-2 flex items-center justify-center mx-auto transition-all ${checked ? `${bg} text-white` : "bg-white border-slate-200 text-transparent hover:border-blue-300"}`}
    >
      <Check size={ic} />
    </button>
  );
}

// ── Eye toggle (for public field) ───────────────────────────────
export function EyeToggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`w-6 h-6 rounded border-2 flex items-center justify-center mx-auto transition-all ${checked ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-slate-200 text-slate-300"}`}
    >
      <Eye size={11} />
    </button>
  );
}

// ── Permission select (colored) ─────────────────────────────────
export function PermissionSelect({ value, onChange, options }) {
  const colors = {
    Modifier: "bg-emerald-50 border-emerald-200 text-emerald-700",
    Voir: "bg-blue-50 border-blue-200 text-blue-700",
    Masquer: "bg-slate-50 border-slate-200 text-slate-500",
  };
  return (
    <select
      value={value || "Masquer"}
      onChange={e => onChange(e.target.value)}
      className={`text-xs rounded px-1.5 py-1 border font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-400 ${colors[value] || colors.Masquer}`}
    >
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

// ── Add Row Button ──────────────────────────────────────────────
export function AddRowButton({ onClick, label = "Ajouter", color = "blue" }) {
  const colors = {
    blue: "text-blue-600 hover:bg-blue-50",
    amber: "text-amber-600 hover:bg-amber-50",
    violet: "text-violet-600 hover:bg-violet-50",
  };
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${colors[color]}`}>
      <Plus size={16} /> {label}
    </button>
  );
}

// ── Delete Button ───────────────────────────────────────────────
export function DeleteButton({ onClick }) {
  return (
    <button onClick={onClick} className="text-slate-400 hover:text-rose-500 transition-colors">
      <Trash2 size={15} />
    </button>
  );
}

// ── Add Column Button ───────────────────────────────────────────
export function AddColButton({ onClick, title = "Ajouter colonne" }) {
  return (
    <button onClick={onClick} title={title} className="w-7 h-7 rounded-lg bg-violet-100 text-violet-600 hover:bg-violet-200 flex items-center justify-center transition-colors">
      <Plus size={14} />
    </button>
  );
}

// ── DataTable — Generic editable table component ────────────────
/**
 * columns: [{ key, label, minWidth, type, options, render }]
 *   type: "text" | "select" | "check" | "permission" | "custom"
 * data: array of objects
 * onUpdate: (id, field, value) => void
 * onDelete: (id) => void
 * onAdd: () => void
 * addLabel: string
 * extraHeaderRight: ReactNode (e.g. add column button)
 * rowClass: (item, index) => string
 * headerClass: string
 */
export function DataTable({
  columns, data, onUpdate, onDelete, onAdd, addLabel = "Ajouter",
  addColor = "blue", extraHeaderRight, headerClass = "bg-slate-50", rowHighlight = true,
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className={`${headerClass} border-b border-slate-200`}>
              {columns.map(col => (
                <th key={col.key} className={`text-left p-3 font-semibold text-slate-600 ${col.center ? "text-center" : ""}`} style={{ minWidth: col.minWidth || "auto" }}>
                  {col.label}
                </th>
              ))}
              {(onDelete || extraHeaderRight) && (
                <th className="p-3 w-10">{extraHeaderRight}</th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={item.id} className={`border-b border-slate-100 ${rowHighlight && i % 2 ? "bg-slate-50/50" : ""} hover:bg-blue-50/30 transition-colors`}>
                {columns.map(col => (
                  <td key={col.key} className={`p-3 ${col.center ? "text-center" : ""} ${col.tdClass || ""}`}>
                    {col.type === "text" && (
                      <InlineInput
                        value={item[col.key]}
                        onChange={v => onUpdate(item.id, col.key, v)}
                        placeholder={col.placeholder}
                        className={col.inputClass}
                        disabled={col.disabled?.(item)}
                      />
                    )}
                    {col.type === "select" && (
                      <Select
                        value={item[col.key]}
                        onChange={v => onUpdate(item.id, col.key, v)}
                        options={typeof col.options === "function" ? col.options(item) : col.options}
                        className={col.selectClass}
                      />
                    )}
                    {col.type === "check" && (
                      <CheckToggle
                        checked={item[col.key] === "Oui"}
                        onChange={v => onUpdate(item.id, col.key, v ? "Oui" : "Non")}
                        color={col.color}
                        size={col.size}
                      />
                    )}
                    {col.type === "badge" && col.render?.(item)}
                    {col.type === "custom" && col.render?.(item, i)}
                  </td>
                ))}
                {onDelete && (
                  <td className="p-3">
                    {(!item.standard) && <DeleteButton onClick={() => onDelete(item.id)} />}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {onAdd && (
        <div className="p-4 border-t border-slate-100">
          <AddRowButton onClick={onAdd} label={addLabel} color={addColor} />
        </div>
      )}
    </div>
  );
}
