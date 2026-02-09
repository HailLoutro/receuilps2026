// ━━━ UI COMPONENTS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
import { useRef } from "react";
import { X, Upload } from "lucide-react";

const VS = {
  primary: "bg-[#1a1f6c] text-white hover:bg-[#2d3494] shadow-sm",
  secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50",
  danger: "bg-rose-600 text-white hover:bg-rose-700",
  ghost: "text-slate-600 hover:bg-slate-100",
  success: "bg-emerald-600 text-white hover:bg-emerald-700",
};
const SS = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2.5 text-sm", lg: "px-6 py-3 text-base" };

export function Btn({ children, onClick, v = "primary", s = "md", className = "", disabled, ...p }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none ${SS[s]} ${VS[v]} ${className}`} {...p}>
      {children}
    </button>
  );
}

export function Inp({ label, value, onChange, type = "text", ph = "", className = "", ...p }) {
  return (
    <div className={className}>
      {label && <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>}
      <input type={type} value={value || ""} onChange={e => onChange(e.target.value)} placeholder={ph}
        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1f6c]/30 focus:border-[#1a1f6c]" {...p} />
    </div>
  );
}

export function Sel({ label, value, onChange, opts, className = "" }) {
  return (
    <div className={className}>
      {label && <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>}
      <select value={value || ""} onChange={e => onChange(e.target.value)}
        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1f6c]/30 bg-white">
        <option value="">—</option>
        {opts.map(o => typeof o === "string"
          ? <option key={o} value={o}>{o}</option>
          : <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    </div>
  );
}

export function Card({ children, className = "", ...p }) {
  return <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm ${className}`} {...p}>{children}</div>;
}

export function Modal({ open, onClose, title, children, wide }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className={`relative bg-white rounded-2xl shadow-2xl ${wide ? "max-w-4xl" : "max-w-lg"} w-full max-h-[85vh] flex flex-col`} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center"><X size={18} /></button>
        </div>
        <div className="p-5 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}

export function Empty({ icon: Ic, title, desc, action }) {
  return (
    <div className="text-center py-16">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4"><Ic size={24} className="text-slate-400" /></div>
      <h3 className="font-bold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 mb-5 max-w-sm mx-auto">{desc}</p>
      {action}
    </div>
  );
}

// FIX #7: Upload d'images depuis l'appareil
export function FileUpload({ accept, onUpload, label = "Charger" }) {
  const ref = useRef(null);
  const handle = e => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => onUpload(reader.result, f.name);
    reader.readAsDataURL(f);
    e.target.value = "";
  };
  return (
    <>
      <input ref={ref} type="file" accept={accept} onChange={handle} className="hidden" />
      <Btn v="secondary" s="sm" onClick={() => ref.current?.click()}><Upload size={14} /> {label}</Btn>
    </>
  );
}
