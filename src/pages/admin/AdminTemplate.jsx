// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ADMIN TEMPLATE — Éditeur de pages + blocs (Notion-style)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { useState } from "react";
import { Plus, GripVertical, X, FileText, Layout } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { BLOCK_TYPES, ICON_MAP, uid } from "../../config/constants";
import { Inp, Sel, Modal, Empty } from "../../components/ui";
import BlockEditor from "../../components/editor/BlockEditor";

// Default content for a new block
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
  const { template, saveTemplate } = useApp();
  const [activePage, setActivePage] = useState(null);
  const [showAddBlock, setShowAddBlock] = useState(false);
  const [showAddPage, setShowAddPage] = useState(false);
  const [newPage, setNewPage] = useState({ title: "", icon: "FileText", group: "Autre" });

  const pages = template.pages || [];
  const page = pages.find((p) => p.id === activePage);

  const updatePages = (newPages) => saveTemplate({ ...template, pages: newPages });

  // ── Page operations ────────────────────────────────────────

  const addPage = () => {
    const p = { id: uid("pg"), title: newPage.title || "Nouvelle page", icon: newPage.icon, group: newPage.group, blocks: [] };
    updatePages([...pages, p]);
    setActivePage(p.id);
    setShowAddPage(false);
    setNewPage({ title: "", icon: "FileText", group: "Autre" });
  };

  const deletePage = (id) => {
    if (!confirm("Supprimer cette page ?")) return;
    updatePages(pages.filter((p) => p.id !== id));
    if (activePage === id) setActivePage(pages[0]?.id || null);
  };

  const movePage = (fromIdx, toIdx) => {
    if (toIdx < 0 || toIdx >= pages.length) return;
    const arr = [...pages];
    const [item] = arr.splice(fromIdx, 1);
    arr.splice(toIdx, 0, item);
    updatePages(arr);
  };

  const updatePageField = (id, field, val) => {
    updatePages(pages.map((p) => (p.id === id ? { ...p, [field]: val } : p)));
  };

  // ── Block operations ───────────────────────────────────────

  const addBlock = (type) => {
    if (!page) return;
    const block = { id: uid("bl"), type, content: defaultBlockContent(type) };
    updatePages(pages.map((p) => (p.id === page.id ? { ...p, blocks: [...p.blocks, block] } : p)));
    setShowAddBlock(false);
  };

  const updateBlock = (blockIdx, newBlock) => {
    updatePages(pages.map((p) => (p.id === page.id ? { ...p, blocks: p.blocks.map((b, i) => (i === blockIdx ? newBlock : b)) } : p)));
  };

  const deleteBlock = (blockIdx) => {
    updatePages(pages.map((p) => (p.id === page.id ? { ...p, blocks: p.blocks.filter((_, i) => i !== blockIdx) } : p)));
  };

  const moveBlock = (fromIdx, toIdx) => {
    if (!page || toIdx < 0 || toIdx >= page.blocks.length) return;
    const arr = [...page.blocks];
    const [item] = arr.splice(fromIdx, 1);
    arr.splice(toIdx, 0, item);
    updatePages(pages.map((p) => (p.id === page.id ? { ...p, blocks: arr } : p)));
  };

  // ── Available groups ───────────────────────────────────────

  const groups = [...new Set(pages.map((p) => p.group).filter(Boolean)), "Général", "Configuration", "Données", "Processus", "Interface", "Avancé", "Autre"];

  // ── Render ─────────────────────────────────────────────────

  return (
    <div className="flex gap-6 h-[calc(100vh-80px)]">
      {/* Left: Page list */}
      <div className="w-72 flex-shrink-0 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-800 text-sm">Pages</h3>
          <button onClick={() => setShowAddPage(true)} className="text-slate-500 hover:text-brand-700 hover:bg-slate-100 w-7 h-7 rounded-lg flex items-center justify-center">
            <Plus size={14} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1">
          {pages.map((p, i) => {
            const Icon = ICON_MAP[p.icon] || FileText;
            return (
              <div
                key={p.id}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm cursor-pointer transition-all group ${
                  activePage === p.id ? "bg-brand-700 text-white shadow-md" : "hover:bg-slate-100 text-slate-700"
                }`}
                draggable
                onDragStart={(e) => e.dataTransfer.setData("pg-idx", String(i))}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); const from = parseInt(e.dataTransfer.getData("pg-idx")); if (!isNaN(from)) movePage(from, i); }}
                onClick={() => setActivePage(p.id)}
              >
                <GripVertical size={12} className={`cursor-grab ${activePage === p.id ? "text-white/50" : "text-slate-400"}`} />
                <Icon size={16} className="flex-shrink-0" />
                <span className="truncate flex-1 font-medium">{p.title}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); deletePage(p.id); }}
                  className={`w-5 h-5 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 ${
                    activePage === p.id ? "hover:bg-white/20 text-white" : "hover:bg-rose-50 text-rose-400"
                  }`}
                >
                  <X size={12} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: Block editor */}
      <div className="flex-1 overflow-y-auto">
        {page ? (
          <div className="space-y-4">
            {/* Page settings bar */}
            <div className="flex items-center gap-4 mb-2">
              <Inp value={page.title} onChange={(v) => updatePageField(page.id, "title", v)} className="flex-1" placeholder="Titre de la page" />
              <Sel value={page.icon} onChange={(v) => updatePageField(page.id, "icon", v)} options={Object.keys(ICON_MAP).map((k) => ({ value: k, label: k }))} className="w-36" />
              <Sel value={page.group} onChange={(v) => updatePageField(page.id, "group", v)} options={groups} className="w-36" />
            </div>

            {/* Blocks */}
            {page.blocks.map((block, i) => (
              <BlockEditor
                key={block.id}
                block={block}
                index={i}
                total={page.blocks.length}
                onChange={(newBlock) => updateBlock(i, newBlock)}
                onDelete={() => deleteBlock(i)}
                onMove={moveBlock}
              />
            ))}

            {/* Add block CTA */}
            <button
              onClick={() => setShowAddBlock(true)}
              className="w-full border-2 border-dashed border-slate-200 rounded-xl py-6 text-slate-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2 font-semibold text-sm"
            >
              <Plus size={18} /> Ajouter un bloc
            </button>
          </div>
        ) : (
          <Empty icon={Layout} title="Sélectionnez une page" desc="Choisissez une page à éditer dans la liste de gauche, ou créez-en une nouvelle." />
        )}
      </div>

      {/* Add block modal */}
      <Modal open={showAddBlock} onClose={() => setShowAddBlock(false)} title="Ajouter un bloc">
        <div className="grid grid-cols-2 gap-3">
          {BLOCK_TYPES.map((bt) => (
            <button
              key={bt.type}
              onClick={() => addBlock(bt.type)}
              className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50/50 transition-all text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                <bt.icon size={18} className="text-slate-600" />
              </div>
              <div>
                <div className="font-semibold text-sm text-slate-900">{bt.label}</div>
                <div className="text-xs text-slate-500">{bt.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </Modal>

      {/* Add page modal */}
      <Modal open={showAddPage} onClose={() => setShowAddPage(false)} title="Nouvelle page">
        <div className="space-y-4">
          <Inp label="Titre" value={newPage.title} onChange={(v) => setNewPage({ ...newPage, title: v })} placeholder="Titre de la page" />
          <Sel label="Icône" value={newPage.icon} onChange={(v) => setNewPage({ ...newPage, icon: v })} options={Object.keys(ICON_MAP).map((k) => ({ value: k, label: k }))} />
          <Sel label="Groupe" value={newPage.group} onChange={(v) => setNewPage({ ...newPage, group: v })} options={["Général", "Configuration", "Données", "Processus", "Interface", "Avancé", "Autre"]} />
          <button onClick={addPage} className="w-full bg-brand-700 text-white font-semibold py-2.5 rounded-xl hover:bg-brand-600">
            Créer la page
          </button>
        </div>
      </Modal>
    </div>
  );
}
