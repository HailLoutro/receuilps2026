// ━━━ BLOCK EDITOR ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
import { useState } from "react";
import { GripVertical, ArrowUp, ArrowDown, Trash2, ChevronDown, Eye, EyeOff } from "lucide-react";
import { BLOCK_TYPES } from "../../config/constants";
import { Inp, Sel, FileUpload } from "../ui";
import TableBlockEditor from "./TableBlockEditor";
import BlockPreview from "./BlockPreview";

export default function BlockEditor({ block, onChange, onDel, onMove, idx, total }) {
  const [exp, setExp] = useState(false);
  const [preview, setPreview] = useState(false);
  const [dOver, setDOver] = useState(false);
  const c = block.content || {};
  const up = (f, v) => onChange({ ...block, content: { ...c, [f]: v } });
  const ti = BLOCK_TYPES.find(t => t.type === block.type) || { label: "?", icon: () => null };
  const TI = ti.icon;

  const editor = () => {
    switch (block.type) {
      case "heading":
        return <div className="space-y-3"><Inp label="Titre" value={c.title} onChange={v => up("title", v)} ph="Titre" /><Inp label="Sous-titre" value={c.subtitle} onChange={v => up("subtitle", v)} ph="Description" /></div>;
      case "text":
        return <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Contenu</label><textarea value={c.text || ""} onChange={e => up("text", e.target.value)} rows={4} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1f6c]/30 resize-y" /></div>;
      case "info":
        return (
          <div className="space-y-3">
            <Sel label="Style" value={c.variant || "info"} onChange={v => up("variant", v)} opts={[{ v: "info", l: "ℹ️ Info" }, { v: "tip", l: "💡 Conseil" }, { v: "warning", l: "⚠️ Attention" }]} />
            <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Contenu (utiliser **gras**)</label><textarea value={c.text || ""} onChange={e => up("text", e.target.value)} rows={3} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1f6c]/30 resize-y" /></div>
          </div>
        );
      case "image":
        // FIX #7: upload local ou URL
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <FileUpload accept="image/*" onUpload={url => up("url", url)} label="Charger une image" />
              <span className="text-xs text-slate-400">ou</span>
              <Inp value={c.url?.startsWith("data:") ? "" : (c.url || "")} onChange={v => up("url", v)} ph="https://..." className="flex-1" />
            </div>
            <Inp label="Légende" value={c.caption} onChange={v => up("caption", v)} />
            {c.url && <img src={c.url} alt="" className="rounded-lg max-h-48 object-cover border" onError={e => { e.target.style.display = "none"; }} />}
          </div>
        );
      case "video":
        return <div className="space-y-3"><Inp label="URL vidéo (YouTube, Vimeo)" value={c.url} onChange={v => up("url", v)} ph="https://youtube.com/..." /><Inp label="Légende" value={c.caption} onChange={v => up("caption", v)} /></div>;
      case "table":
        return <TableBlockEditor content={c} onChange={nc => onChange({ ...block, content: nc })} />;
      default: return null;
    }
  };

  const summary = () => {
    if (block.type === "heading") return c.title || "";
    if (block.type === "table") return c.title || "";
    return (c.text || "").substring(0, 50);
  };

  return (
    <div
      className={`border rounded-xl transition-all ${exp ? "border-blue-300 shadow-md" : "border-slate-200 hover:border-slate-300"} ${dOver ? "border-blue-500 bg-blue-50/50" : "bg-white"}`}
      draggable
      onDragStart={e => { e.dataTransfer.setData("blk", String(idx)); e.dataTransfer.effectAllowed = "move"; }}
      onDragOver={e => { e.preventDefault(); setDOver(true); }}
      onDragLeave={() => setDOver(false)}
      onDrop={e => { e.preventDefault(); setDOver(false); const f = parseInt(e.dataTransfer.getData("blk")); if (!isNaN(f) && f !== idx) onMove(f, idx); }}
    >
      <div className="flex items-center gap-2 px-4 py-3 cursor-pointer" onClick={() => setExp(!exp)}>
        <div className="cursor-grab text-slate-400 hover:text-slate-600"><GripVertical size={16} /></div>
        <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center"><TI size={14} className="text-slate-500" /></div>
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{ti.label}</span>
        <span className="text-sm text-slate-700 truncate flex-1 font-medium">{summary()}</span>
        <div className="flex items-center gap-1">
          {/* FIX #8: preview toggle */}
          <button onClick={e => { e.stopPropagation(); setPreview(!preview); setExp(true); }}
            className={`w-6 h-6 rounded flex items-center justify-center ${preview ? "bg-blue-100 text-blue-600" : "hover:bg-slate-100 text-slate-400"}`} title="Aperçu">
            {preview ? <Eye size={12} /> : <EyeOff size={12} />}
          </button>
          <button onClick={e => { e.stopPropagation(); onMove(idx, idx - 1); }} disabled={idx === 0} className="w-6 h-6 rounded hover:bg-slate-100 flex items-center justify-center disabled:opacity-30"><ArrowUp size={12} /></button>
          <button onClick={e => { e.stopPropagation(); onMove(idx, idx + 1); }} disabled={idx >= total - 1} className="w-6 h-6 rounded hover:bg-slate-100 flex items-center justify-center disabled:opacity-30"><ArrowDown size={12} /></button>
          <button onClick={e => { e.stopPropagation(); if (confirm("Supprimer ce bloc ?")) onDel(); }} className="w-6 h-6 rounded hover:bg-rose-50 text-slate-400 hover:text-rose-500 flex items-center justify-center"><Trash2 size={12} /></button>
          <ChevronDown size={16} className={`text-slate-400 transition-transform ${exp ? "rotate-180" : ""}`} />
        </div>
      </div>
      {exp && (
        <div className="px-4 pb-4 pt-1 border-t border-slate-100">
          {preview ? <div className="p-4 bg-slate-50 rounded-xl"><BlockPreview block={block} /></div> : editor()}
        </div>
      )}
    </div>
  );
}
