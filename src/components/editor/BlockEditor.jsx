// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BLOCK EDITOR — Éditeur de bloc (admin template editor)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { useState } from "react";
import { GripVertical, ArrowUp, ArrowDown, Trash2, ChevronDown } from "lucide-react";
import { BLOCK_TYPES, INFO_VARIANTS } from "../../config/constants";
import { Inp, Sel } from "../ui";
import TableBlockEditor from "./TableBlockEditor";

export default function BlockEditor({ block, onChange, onDelete, onMove, index, total }) {
  const [expanded, setExpanded] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const c = block.content || {};

  const update = (field, val) => onChange({ ...block, content: { ...c, [field]: val } });

  const typeInfo = BLOCK_TYPES.find((t) => t.type === block.type) || { label: "?", icon: () => null };
  const TypeIcon = typeInfo.icon;

  // ── Block-specific editor ──────────────────────────────────

  const renderEditor = () => {
    switch (block.type) {
      case "heading":
        return (
          <div className="space-y-3">
            <Inp label="Titre" value={c.title} onChange={(v) => update("title", v)} placeholder="Titre de section" />
            <Inp label="Sous-titre" value={c.subtitle} onChange={(v) => update("subtitle", v)} placeholder="Description" />
          </div>
        );

      case "text":
        return (
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Contenu</label>
            <textarea
              value={c.text || ""}
              onChange={(e) => update("text", e.target.value)}
              rows={4}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 resize-y"
            />
          </div>
        );

      case "info":
        return (
          <div className="space-y-3">
            <Sel
              label="Style"
              value={c.variant || "info"}
              onChange={(v) => update("variant", v)}
              options={INFO_VARIANTS}
            />
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Contenu</label>
              <textarea
                value={c.text || ""}
                onChange={(e) => update("text", e.target.value)}
                rows={3}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 resize-y"
              />
            </div>
          </div>
        );

      case "image":
        return (
          <div className="space-y-3">
            <Inp label="URL image" value={c.url} onChange={(v) => update("url", v)} placeholder="https://..." />
            <Inp label="Légende" value={c.caption} onChange={(v) => update("caption", v)} />
            {c.url && <img src={c.url} alt="" className="rounded-lg max-h-48 object-cover border" onError={(e) => (e.target.style.display = "none")} />}
          </div>
        );

      case "video":
        return (
          <div className="space-y-3">
            <Inp label="URL vidéo" value={c.url} onChange={(v) => update("url", v)} placeholder="https://youtube.com/..." />
            <Inp label="Légende" value={c.caption} onChange={(v) => update("caption", v)} />
          </div>
        );

      case "table":
        return <TableBlockEditor content={c} onChange={(nc) => onChange({ ...block, content: nc })} />;

      default:
        return null;
    }
  };

  // ── Preview text for collapsed state ───────────────────────

  const previewText = () => {
    switch (block.type) {
      case "heading": return c.title || "";
      case "table":   return c.title || "";
      case "text":    return (c.text || "").substring(0, 60);
      case "info":    return (c.text || "").substring(0, 60);
      default:        return "";
    }
  };

  // ── Render ─────────────────────────────────────────────────

  return (
    <div
      className={`border rounded-xl transition-all ${
        expanded ? "border-blue-300 shadow-md" : "border-slate-200 hover:border-slate-300"
      } ${dragOver ? "border-blue-500 bg-blue-50/50" : "bg-white"}`}
      draggable
      onDragStart={(e) => { e.dataTransfer.setData("blk-idx", String(index)); e.dataTransfer.effectAllowed = "move"; }}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => { e.preventDefault(); setDragOver(false); const from = parseInt(e.dataTransfer.getData("blk-idx")); if (!isNaN(from) && from !== index) onMove(from, index); }}
    >
      {/* Header bar */}
      <div className="flex items-center gap-2 px-4 py-3 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="cursor-grab text-slate-400 hover:text-slate-600"><GripVertical size={16} /></div>
        <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center"><TypeIcon size={14} className="text-slate-500" /></div>
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{typeInfo.label}</span>
        <span className="text-sm text-slate-700 truncate flex-1 font-medium">{previewText()}</span>

        <div className="flex items-center gap-1">
          <button onClick={(e) => { e.stopPropagation(); onMove(index, index - 1); }} disabled={index === 0} className="w-6 h-6 rounded hover:bg-slate-100 flex items-center justify-center disabled:opacity-30">
            <ArrowUp size={12} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onMove(index, index + 1); }} disabled={index >= total - 1} className="w-6 h-6 rounded hover:bg-slate-100 flex items-center justify-center disabled:opacity-30">
            <ArrowDown size={12} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="w-6 h-6 rounded hover:bg-rose-50 text-slate-400 hover:text-rose-500 flex items-center justify-center">
            <Trash2 size={12} />
          </button>
          <ChevronDown size={16} className={`text-slate-400 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </div>
      </div>

      {/* Expanded editor */}
      {expanded && (
        <div className="px-4 pb-4 pt-1 border-t border-slate-100">
          {renderEditor()}
        </div>
      )}
    </div>
  );
}
