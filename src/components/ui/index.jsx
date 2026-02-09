// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// UI COMPONENTS — Composants réutilisables
// ➜ Importer depuis "@/components/ui"
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { X } from "lucide-react";

// ── Button ───────────────────────────────────────────────────

const VARIANTS = {
  primary:   "bg-brand-700 text-white hover:bg-brand-600 shadow-sm",
  secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50",
  danger:    "bg-rose-600 text-white hover:bg-rose-700",
  ghost:     "text-slate-600 hover:bg-slate-100",
  success:   "bg-emerald-600 text-white hover:bg-emerald-700",
};
const SIZES = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

export function Btn({ children, onClick, variant = "primary", size = "md", className = "", disabled, ...p }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none ${SIZES[size]} ${VARIANTS[variant]} ${className}`}
      {...p}
    >
      {children}
    </button>
  );
}

// ── Input ────────────────────────────────────────────────────

export function Inp({ label, value, onChange, type = "text", placeholder = "", className = "", ...p }) {
  return (
    <div className={className}>
      {label && <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>}
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
        {...p}
      />
    </div>
  );
}

// ── Select ───────────────────────────────────────────────────

export function Sel({ label, value, onChange, options, className = "" }) {
  return (
    <div className={className}>
      {label && <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>}
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 bg-white"
      >
        <option value="">—</option>
        {options.map((o) =>
          typeof o === "string"
            ? <option key={o} value={o}>{o}</option>
            : <option key={o.value} value={o.value}>{o.label}</option>
        )}
      </select>
    </div>
  );
}

// ── Card ─────────────────────────────────────────────────────

export function Card({ children, className = "", ...p }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm ${className}`} {...p}>
      {children}
    </div>
  );
}

// ── Modal ────────────────────────────────────────────────────

export function Modal({ open, onClose, title, children, wide = false }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className={`relative bg-white rounded-2xl shadow-2xl ${wide ? "max-w-4xl" : "max-w-lg"} w-full max-h-[85vh] flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center">
            <X size={18} />
          </button>
        </div>
        <div className="p-5 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}

// ── Empty State ──────────────────────────────────────────────

export function Empty({ icon: Ic, title, desc, action }) {
  return (
    <div className="text-center py-16 px-8">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
        <Ic size={24} className="text-slate-400" />
      </div>
      <h3 className="font-bold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 mb-5 max-w-sm mx-auto">{desc}</p>
      {action}
    </div>
  );
}
