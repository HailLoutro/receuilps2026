// ━━━ CLIENT RECUEIL ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
import { useState, useEffect } from "react";
import {
  Layers, ChevronLeft, Menu, LogOut, Clock, CheckCircle2,
  BookOpen, FileText, ExternalLink, Plus,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { BRAND, ICONS, uid } from "../../config/constants";
import { Empty } from "../../components/ui";
import InlineTable from "../../components/editor/InlineTable";

export default function ClientRecueil() {
  const { user, template, cData, sCD, logout, saving } = useApp();
  const [activePage, setActivePage] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pages = template.pages || [];

  useEffect(() => { if (pages.length && !activePage) setActivePage(pages[0].id); }, [pages]);

  const page = pages.find(p => p.id === activePage);
  const pageData = cData[activePage] || {};

  const updateBlockData = (blockId, data) => {
    sCD(user.slug, { ...cData, [activePage]: { ...pageData, [blockId]: data } });
  };

  const getTableRows = block =>
    pageData[block.id]?.rows || (block.content?.defaultRows || []).map(r => ({ ...r }));

  const calcPageProgress = p => {
    const tables = p.blocks.filter(b => b.type === "table");
    if (!tables.length) return 100;
    const d = cData[p.id] || {};
    return Math.round(tables.filter(b => d[b.id]?.rows?.length > 0).length / tables.length * 100);
  };
  const totalProgress = pages.length
    ? Math.round(pages.reduce((a, p) => a + calcPageProgress(p), 0) / pages.length) : 0;

  // ── Block rendering ────────────────────────────────────────
  const renderBlock = block => {
    const c = block.content || {};
    switch (block.type) {
      case "heading":
        return <div className="mb-2"><h2 className="text-2xl font-extrabold text-slate-900">{c.title}</h2>{c.subtitle && <p className="text-slate-500 mt-1">{c.subtitle}</p>}</div>;
      case "text":
        return <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{c.text}</p>;
      case "info": {
        const st = { info: "bg-blue-50 border-blue-200 text-blue-800", tip: "bg-emerald-50 border-emerald-200 text-emerald-800", warning: "bg-amber-50 border-amber-200 text-amber-800" };
        return <div className={`p-4 rounded-xl border text-sm leading-relaxed ${st[c.variant] || st.info}`} dangerouslySetInnerHTML={{ __html: (c.text || "").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />;
      }
      case "image":
        return c.url ? <figure><img src={c.url} alt="" className="rounded-xl max-w-full shadow-sm border" />{c.caption && <figcaption className="text-xs text-slate-500 mt-2 text-center">{c.caption}</figcaption>}</figure> : null;
      case "video":
        return c.url ? (
          <div>
            {(c.url.includes("youtube") || c.url.includes("youtu.be"))
              ? <iframe src={c.url.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")} className="w-full aspect-video rounded-xl border" allowFullScreen />
              : <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline flex items-center gap-1"><ExternalLink size={14} />{c.url}</a>}
            {c.caption && <p className="text-xs text-slate-500 mt-2 text-center">{c.caption}</p>}
          </div>
        ) : null;
      case "table": {
        const rows = getTableRows(block);
        const cols = c.columns || [];
        const extraCols = pageData[block.id]?.extraCols || [];
        const allCols = [...cols, ...extraCols];

        const updateRow = (ri, key, val) => {
          const nr = [...rows]; nr[ri] = { ...nr[ri], [key]: val };
          updateBlockData(block.id, { ...pageData[block.id], rows: nr });
        };
        const addRow = () => {
          const r = { _id: uid("r") }; allCols.forEach(col => { r[col.key] = ""; });
          updateBlockData(block.id, { ...pageData[block.id], rows: [...rows, r] });
        };
        const deleteRow = ri => {
          updateBlockData(block.id, { ...pageData[block.id], rows: rows.filter((_, j) => j !== ri) });
        };
        const addColumn = () => {
          const name = prompt("Nom de la colonne :"); if (!name) return;
          updateBlockData(block.id, {
            ...pageData[block.id],
            extraCols: [...extraCols, { key: `ec_${uid()}`, label: name, type: "text", minWidth: "140px" }],
          });
        };

        return (
          <div>
            {c.title && <h3 className="font-bold text-slate-800 mb-3">{c.title}</h3>}
            <InlineTable columns={allCols} rows={rows} onUR={updateRow} onAR={c.allowAddRows !== false ? addRow : undefined} onDR={deleteRow} edit />
            {c.allowAddCols && <button onClick={addColumn} className="mt-2 flex items-center gap-1 text-xs text-violet-600 hover:text-violet-700"><Plus size={12} /> Ajouter une colonne</button>}
          </div>
        );
      }
      default: return null;
    }
  };

  // ── Layout ─────────────────────────────────────────────────
  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", background: "#f1f5f9" }}>
      <link href={BRAND.font} rel="stylesheet" />

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-72" : "w-0 md:w-16"} bg-[#0a0e3a] text-white flex flex-col transition-all duration-300 overflow-hidden flex-shrink-0`}>
        <div className="p-4 flex items-center gap-3 border-b border-white/10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center flex-shrink-0"><Layers size={18} /></div>
          {sidebarOpen && <div className="min-w-0"><div className="font-bold text-sm">{BRAND.name}</div><div className="text-xs text-blue-300 truncate">{user.name || user.username}</div></div>}
        </div>

        {sidebarOpen && (
          <div className="px-4 py-3 border-b border-white/10">
            <div className="flex items-center justify-between text-xs mb-1.5"><span className="text-blue-300">Progression</span><span className="text-white font-bold">{totalProgress}%</span></div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-blue-400 to-violet-400 rounded-full transition-all duration-500" style={{ width: `${totalProgress}%` }} /></div>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto p-2">
          {pages.map(p => {
            const Ic = ICONS[p.icon] || FileText;
            const pr = calcPageProgress(p);
            return (
              <button key={p.id} onClick={() => setActivePage(p.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm mb-0.5 transition-all ${activePage === p.id ? "bg-white/15 text-white font-semibold" : "text-blue-200/60 hover:bg-white/5 hover:text-white"}`}>
                <Ic size={16} className="flex-shrink-0" />
                {sidebarOpen && <>
                  <span className="truncate flex-1 text-left">{p.title}</span>
                  <span className={`text-[10px] font-bold ${pr >= 70 ? "text-emerald-400" : pr >= 30 ? "text-blue-400/70" : "text-amber-400/70"}`}>{pr}%</span>
                </>}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 flex items-center justify-between">
          <div className="text-xs text-blue-300/70">
            {saving
              ? <span className="flex items-center gap-1"><Clock size={10} className="animate-spin" /> Sauvegarde...</span>
              : <span className="flex items-center gap-1"><CheckCircle2 size={10} className="text-emerald-400" /> Sauvegardé</span>}
          </div>
          <button onClick={logout} className="text-blue-300/60 hover:text-white"><LogOut size={16} /></button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center">
              {sidebarOpen ? <ChevronLeft size={18} className="text-slate-500" /> : <Menu size={18} className="text-slate-500" />}
            </button>
            <div className="h-5 w-px bg-slate-200" />
            <h2 className="font-semibold text-slate-800 text-sm">{page?.title || ""}</h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Auto-save</div>
        </div>

        <div className="p-6 md:p-8 max-w-[1100px] mx-auto space-y-6">
          {page
            ? page.blocks.map(b => <div key={b.id}>{renderBlock(b)}</div>)
            : <Empty icon={BookOpen} title="Bienvenue" desc="Sélectionnez une section dans le menu pour commencer" />}
        </div>
      </main>
    </div>
  );
}
