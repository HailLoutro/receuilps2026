// ━━━ ADMIN TEMPLATE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
import { useState } from "react";
import {
  Plus, X, Layout, FileText, ChevronDown, Monitor,
  GripVertical, ArrowUp, ArrowDown, Trash2, RotateCcw, AlertTriangle, Link,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { ICONS, uid } from "../../config/constants";
import { Btn, Inp, Sel, Card, Modal, Empty } from "../../components/ui";
import BEditor from "../../components/editor/BlockEditor";
import BlockPreview from "../../components/editor/BlockPreview";
import { BLOCK_TYPES } from "../../config/constants";

export default function AdminTemplate() {
  const { template, sT: saveTemplate, roles, resetTemplate } = useApp();
  const [ap, setAp] = useState(null);
  const [showAB, setShowAB] = useState(false);
  const [showAP, setShowAP] = useState(false);
  const [np, setNp] = useState({ title: "", icon: "FileText" });
  const [previewAll, setPreviewAll] = useState(false);

  const pages = template.pages || [];
  const page = pages.find(p => p.id === ap);
  const uP = p => saveTemplate({ ...template, pages: p });

  // ── Page CRUD ──────────────────────────────────────────────
  const addPage = () => {
    const p = { id: uid("pg"), title: np.title || "Nouvelle page", icon: np.icon, blocks: [] };
    uP([...pages, p]); setAp(p.id); setShowAP(false); setNp({ title: "", icon: "FileText" });
  };
  const delPage = id => {
    if (!confirm("Supprimer cette page et tous ses blocs ?")) return;
    uP(pages.filter(p => p.id !== id));
    if (ap === id) setAp(pages[0]?.id || null);
  };
  const movePage = (from, to) => {
    if (to < 0 || to >= pages.length) return;
    const a = [...pages]; const [item] = a.splice(from, 1); a.splice(to, 0, item); uP(a);
  };
  const upPage = (id, field, val) => uP(pages.map(p => p.id === id ? { ...p, [field]: val } : p));

  // ── Block CRUD ─────────────────────────────────────────────
  const defBC = t => {
    switch (t) {
      case "heading": return { title: "Nouveau titre", subtitle: "" };
      case "text": return { text: "" };
      case "info": return { text: "", variant: "info" };
      case "image": return { url: "", caption: "" };
      case "video": return { url: "", caption: "" };
      case "table": return { title: "Nouveau tableau", columns: [{ key: "c1", label: "Nom", type: "text", minWidth: "200px" }], defaultRows: [], allowAddRows: true, allowAddCols: false };
      default: return {};
    }
  };
  const addBlock = type => {
    if (!page) return;
    uP(pages.map(p => p.id === page.id ? { ...p, blocks: [...p.blocks, { id: uid("bl"), type, content: defBC(type) }] } : p));
    setShowAB(false);
  };
  const upBlock = (i, b) => uP(pages.map(p => p.id === page.id ? { ...p, blocks: p.blocks.map((x, j) => j === i ? b : x) } : p));
  const delBlock = i => uP(pages.map(p => p.id === page.id ? { ...p, blocks: p.blocks.filter((_, j) => j !== i) } : p));
  const moveBlock = (from, to) => {
    if (!page || to < 0 || to >= page.blocks.length) return;
    const a = [...page.blocks]; const [item] = a.splice(from, 1); a.splice(to, 0, item);
    uP(pages.map(p => p.id === page.id ? { ...p, blocks: a } : p));
  };

  // ── Role propagation info ──────────────────────────────────
  const blockMeta = block => {
    if (block.type !== "table") return null;
    const c = block.content || {};
    const tags = [];
    if (c.roleSource) tags.push({ label: "Source des rôles", icon: "🔑", color: "bg-amber-100 text-amber-700" });
    if (c.roleCols) tags.push({ label: `Colonnes auto (${c.roleCols.split(":")[0]})`, icon: "🔗", color: "bg-indigo-100 text-indigo-700" });
    if (c.roleOptions) tags.push({ label: "Options = rôles", icon: "📋", color: "bg-violet-100 text-violet-700" });
    if (c.allowAddRows) tags.push({ label: "Client +lignes", icon: "➕", color: "bg-emerald-100 text-emerald-700" });
    if (c.allowAddCols) tags.push({ label: "Client +colonnes", icon: "🧩", color: "bg-blue-100 text-blue-700" });
    return tags.length ? tags : null;
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-80px)]">
      {/* Sidebar pages */}
      <div className="w-64 flex-shrink-0 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-800 text-sm">Pages ({pages.length})</h3>
          <div className="flex gap-1">
            <Btn v="ghost" s="sm" onClick={() => setShowAP(true)}><Plus size={14} /></Btn>
            <Btn v="ghost" s="sm" onClick={() => { if (confirm("Réinitialiser tout le template ? Les données clients ne seront pas affectées.")) resetTemplate(); }}
              className="text-amber-600 hover:bg-amber-50" title="Réinitialiser le template par défaut"><RotateCcw size={14} /></Btn>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto space-y-1">
          {pages.map((p, i) => {
            const Ic = ICONS[p.icon] || FileText;
            return (
              <div key={p.id}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm cursor-pointer transition-all group ${ap === p.id ? "bg-[#1a1f6c] text-white shadow-md" : "hover:bg-slate-100 text-slate-700"}`}
                draggable onDragStart={e => e.dataTransfer.setData("pg", String(i))} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); const f = parseInt(e.dataTransfer.getData("pg")); if (!isNaN(f)) movePage(f, i); }}
                onClick={() => setAp(p.id)}>
                <GripVertical size={12} className={`cursor-grab ${ap === p.id ? "text-white/50" : "text-slate-400"}`} />
                <Ic size={16} className="flex-shrink-0" />
                <span className="truncate flex-1 font-medium">{p.title}</span>
                <span className="text-[10px] opacity-60">{p.blocks.length}b</span>
                <button onClick={e => { e.stopPropagation(); delPage(p.id); }}
                  className={`w-5 h-5 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 ${ap === p.id ? "hover:bg-white/20 text-white" : "hover:bg-rose-50 text-rose-400"}`}>
                  <X size={12} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Roles info */}
        <div className="mt-3 border-t border-slate-200 pt-3">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Rôles détectés</div>
          {roles.length ? (
            <div className="flex flex-wrap gap-1">
              {roles.map(r => <span key={r} className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-semibold">{r}</span>)}
            </div>
          ) : <p className="text-xs text-slate-400 italic">Aucun rôle (le client doit remplir "Rôles & Accès")</p>}
          <p className="text-[10px] text-slate-400 mt-1.5 leading-snug">Les rôles se propagent automatiquement dans les tableaux marqués 🔗</p>
        </div>
      </div>

      {/* Main editor */}
      <div className="flex-1 overflow-y-auto">
        {page ? <div className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <Inp value={page.title} onChange={v => upPage(page.id, "title", v)} className="flex-1" />
            <Sel value={page.icon} onChange={v => upPage(page.id, "icon", v)} opts={Object.keys(ICONS).map(k => ({ v: k, l: k }))} className="w-32" />
            <Btn v={previewAll ? "primary" : "secondary"} s="sm" onClick={() => setPreviewAll(!previewAll)}>
              <Monitor size={14} /> {previewAll ? "Éditer" : "Prévisualiser"}
            </Btn>
          </div>

          {previewAll ? (
            <Card className="p-6 space-y-6">
              <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-2">Aperçu client</div>
              {page.blocks.map(b => <div key={b.id}><BlockPreview block={b} /></div>)}
            </Card>
          ) : <>
            {page.blocks.map((b, i) => (
              <div key={b.id}>
                {/* Role propagation tags */}
                {blockMeta(b) && (
                  <div className="flex flex-wrap gap-1.5 mb-1.5">
                    {blockMeta(b).map((tag, ti) => (
                      <span key={ti} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${tag.color}`}>
                        {tag.icon} {tag.label}
                      </span>
                    ))}
                  </div>
                )}
                <BEditor block={b} idx={i} total={page.blocks.length} onChange={nb => upBlock(i, nb)} onDel={() => delBlock(i)} onMove={moveBlock} />
              </div>
            ))}
            <button onClick={() => setShowAB(true)}
              className="w-full border-2 border-dashed border-slate-200 rounded-xl py-6 text-slate-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2 font-semibold text-sm">
              <Plus size={18} /> Ajouter un bloc
            </button>
          </>}
        </div> : (
          <Empty icon={Layout} title="Sélectionnez une page" desc="Choisissez une page à gauche ou créez-en une" />
        )}
      </div>

      {/* Modal: add block */}
      <Modal open={showAB} onClose={() => setShowAB(false)} title="Ajouter un bloc">
        <div className="grid grid-cols-2 gap-3">
          {BLOCK_TYPES.map(bt => (
            <button key={bt.type} onClick={() => addBlock(bt.type)}
              className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50/50 transition-all text-left">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center"><bt.icon size={18} className="text-slate-600" /></div>
              <div><div className="font-semibold text-sm text-slate-900">{bt.label}</div><div className="text-xs text-slate-500">{bt.desc}</div></div>
            </button>
          ))}
        </div>
      </Modal>

      {/* Modal: new page */}
      <Modal open={showAP} onClose={() => setShowAP(false)} title="Nouvelle page">
        <div className="space-y-4">
          <Inp label="Titre" value={np.title} onChange={v => setNp({ ...np, title: v })} />
          <Sel label="Icône" value={np.icon} onChange={v => setNp({ ...np, icon: v })} opts={Object.keys(ICONS).map(k => ({ v: k, l: k }))} />
          <Btn onClick={addPage} className="w-full">Créer la page</Btn>
        </div>
      </Modal>
    </div>
  );
}
