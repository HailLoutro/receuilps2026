// ━━━ ADMIN TEMPLATE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FIX #4: plus de sélecteur "group" — juste titre + icône
// FIX #8: bouton "Prévisualiser" la page entière
import { useState } from "react";
import { Plus, GripVertical, X, FileText, Layout, Monitor } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { BLOCK_TYPES, ICONS, uid } from "../../config/constants";
import { Inp, Sel, Btn, Modal, Empty, Card } from "../../components/ui";
import BlockEditor from "../../components/editor/BlockEditor";
import BlockPreview from "../../components/editor/BlockPreview";

function defaultBlockContent(type) {
  switch (type) {
    case "heading": return { title: "Nouveau titre", subtitle: "" };
    case "text":    return { text: "" };
    case "info":    return { text: "", variant: "info" };
    case "image":   return { url: "", caption: "" };
    case "video":   return { url: "", caption: "" };
    case "table":   return { title: "Nouveau tableau", columns: [{ key: "c1", label: "Nom", type: "text", minWidth: "200px" }], defaultRows: [], allowAddRows: true, allowAddCols: false };
    default:        return {};
  }
}

export default function AdminTemplate() {
  const { template, sT } = useApp();
  const [activePage, setActivePage] = useState(null);
  const [showAddBlock, setShowAddBlock] = useState(false);
  const [showAddPage, setShowAddPage] = useState(false);
  const [newPage, setNewPage] = useState({ title: "", icon: "FileText" });
  const [previewAll, setPreviewAll] = useState(false);

  const pages = template.pages || [];
  const page = pages.find(p => p.id === activePage);
  const updatePages = p => sT({ ...template, pages: p });

  // ── Page ops ────────────────────────────────────────────────
  const addPage = () => {
    const p = { id: uid("pg"), title: newPage.title || "Nouvelle page", icon: newPage.icon, blocks: [] };
    updatePages([...pages, p]);
    setActivePage(p.id);
    setShowAddPage(false);
    setNewPage({ title: "", icon: "FileText" });
  };
  const deletePage = id => {
    if (!confirm("Supprimer cette page et tous ses blocs ?")) return;
    updatePages(pages.filter(p => p.id !== id));
    if (activePage === id) setActivePage(pages[0]?.id || null);
  };
  const movePage = (from, to) => {
    if (to < 0 || to >= pages.length) return;
    const arr = [...pages]; const [item] = arr.splice(from, 1); arr.splice(to, 0, item);
    updatePages(arr);
  };
  const updatePageField = (id, field, val) => updatePages(pages.map(p => p.id === id ? { ...p, [field]: val } : p));

  // ── Block ops ───────────────────────────────────────────────
  const addBlock = type => {
    if (!page) return;
    updatePages(pages.map(p => p.id === page.id ? { ...p, blocks: [...p.blocks, { id: uid("bl"), type, content: defaultBlockContent(type) }] } : p));
    setShowAddBlock(false);
  };
  const updateBlock = (idx, newBlock) => updatePages(pages.map(p => p.id === page.id ? { ...p, blocks: p.blocks.map((b, i) => i === idx ? newBlock : b) } : p));
  const deleteBlock = idx => updatePages(pages.map(p => p.id === page.id ? { ...p, blocks: p.blocks.filter((_, i) => i !== idx) } : p));
  const moveBlock = (from, to) => {
    if (!page || to < 0 || to >= page.blocks.length) return;
    const arr = [...page.blocks]; const [item] = arr.splice(from, 1); arr.splice(to, 0, item);
    updatePages(pages.map(p => p.id === page.id ? { ...p, blocks: arr } : p));
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-80px)]">
      {/* Page sidebar */}
      <div className="w-64 flex-shrink-0 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-800 text-sm">Pages ({pages.length})</h3>
          <Btn v="ghost" s="sm" onClick={() => setShowAddPage(true)}><Plus size={14} /></Btn>
        </div>
        <div className="flex-1 overflow-y-auto space-y-1">
          {pages.map((p, i) => {
            const Ic = ICONS[p.icon] || FileText;
            return (
              <div key={p.id}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm cursor-pointer transition-all group ${activePage === p.id ? "bg-[#1a1f6c] text-white shadow-md" : "hover:bg-slate-100 text-slate-700"}`}
                draggable
                onDragStart={e => e.dataTransfer.setData("pg", String(i))}
                onDragOver={e => e.preventDefault()}
                onDrop={e => { e.preventDefault(); const f = parseInt(e.dataTransfer.getData("pg")); if (!isNaN(f)) movePage(f, i); }}
                onClick={() => setActivePage(p.id)}>
                <GripVertical size={12} className={`cursor-grab ${activePage === p.id ? "text-white/50" : "text-slate-400"}`} />
                <Ic size={16} className="flex-shrink-0" />
                <span className="truncate flex-1 font-medium">{p.title}</span>
                <span className="text-[10px] opacity-60">{p.blocks.length}b</span>
                <button onClick={e => { e.stopPropagation(); deletePage(p.id); }}
                  className={`w-5 h-5 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 ${activePage === p.id ? "hover:bg-white/20 text-white" : "hover:bg-rose-50 text-rose-400"}`}>
                  <X size={12} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Block editor area */}
      <div className="flex-1 overflow-y-auto">
        {page ? (
          <div className="space-y-4">
            {/* FIX #4: only title + icon, no group selector */}
            <div className="flex items-center gap-3 mb-2">
              <Inp value={page.title} onChange={v => updatePageField(page.id, "title", v)} className="flex-1" ph="Titre de la page" />
              <Sel value={page.icon} onChange={v => updatePageField(page.id, "icon", v)} opts={Object.keys(ICONS).map(k => ({ v: k, l: k }))} className="w-32" />
              <Btn v={previewAll ? "primary" : "secondary"} s="sm" onClick={() => setPreviewAll(!previewAll)}>
                <Monitor size={14} /> {previewAll ? "Éditer" : "Prévisualiser"}
              </Btn>
            </div>

            {previewAll ? (
              <Card className="p-6 space-y-6">
                <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-2">Aperçu client</div>
                {page.blocks.map(b => <div key={b.id}><BlockPreview block={b} /></div>)}
              </Card>
            ) : (
              <>
                {page.blocks.map((b, i) => (
                  <BlockEditor key={b.id} block={b} idx={i} total={page.blocks.length}
                    onChange={nb => updateBlock(i, nb)} onDel={() => deleteBlock(i)} onMove={moveBlock} />
                ))}
                <button onClick={() => setShowAddBlock(true)}
                  className="w-full border-2 border-dashed border-slate-200 rounded-xl py-6 text-slate-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2 font-semibold text-sm">
                  <Plus size={18} /> Ajouter un bloc
                </button>
              </>
            )}
          </div>
        ) : (
          <Empty icon={Layout} title="Sélectionnez une page" desc="Choisissez une page à gauche ou créez-en une" />
        )}
      </div>

      {/* Add block modal */}
      <Modal open={showAddBlock} onClose={() => setShowAddBlock(false)} title="Ajouter un bloc">
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

      {/* Add page modal */}
      <Modal open={showAddPage} onClose={() => setShowAddPage(false)} title="Nouvelle page">
        <div className="space-y-4">
          <Inp label="Titre" value={newPage.title} onChange={v => setNewPage({ ...newPage, title: v })} ph="Titre de la page" />
          <Sel label="Icône" value={newPage.icon} onChange={v => setNewPage({ ...newPage, icon: v })} opts={Object.keys(ICONS).map(k => ({ v: k, l: k }))} />
          <Btn onClick={addPage} className="w-full">Créer la page</Btn>
        </div>
      </Modal>
    </div>
  );
}
