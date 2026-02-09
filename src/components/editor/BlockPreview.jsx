// ━━━ BLOCK PREVIEW ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FIX #8 : rendu identique à la vue client
import InlineTable from "./InlineTable";

export default function BlockPreview({ block }) {
  const c = block.content || {};
  switch (block.type) {
    case "heading":
      return <div className="mb-1"><h2 className="text-xl font-extrabold text-slate-900">{c.title || "Sans titre"}</h2>{c.subtitle && <p className="text-slate-500 text-sm">{c.subtitle}</p>}</div>;
    case "text":
      return <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-sm">{c.text || <span className="text-slate-300 italic">Texte vide</span>}</p>;
    case "info": {
      const st = { info: "bg-blue-50 border-blue-200 text-blue-800", tip: "bg-emerald-50 border-emerald-200 text-emerald-800", warning: "bg-amber-50 border-amber-200 text-amber-800" };
      return <div className={`p-3 rounded-xl border text-sm ${st[c.variant] || st.info}`} dangerouslySetInnerHTML={{ __html: (c.text || "").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />;
    }
    case "image":
      return c.url ? <img src={c.url} alt="" className="rounded-lg max-h-40 object-cover border" /> : <div className="h-24 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 text-sm">Aucune image</div>;
    case "video":
      return <div className="h-24 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 text-sm">{c.url ? "▶ Vidéo" : "Aucune vidéo"}</div>;
    case "table":
      return <div className="text-sm"><div className="font-semibold text-slate-700 mb-2">{c.title || "Tableau"}</div><InlineTable columns={c.columns || []} rows={c.defaultRows || []} edit={false} /></div>;
    default: return null;
  }
}
