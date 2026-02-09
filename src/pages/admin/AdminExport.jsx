// ━━━ ADMIN EXPORT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FIX #6: section export clairement visible dans la nav admin
import { useState } from "react";
import { Download, FileJson, FileSpreadsheet, Clock } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { exportJSON, exportExcel } from "../../services/export";
import { Btn, Card, Empty } from "../../components/ui";
import InlineTable from "../../components/editor/InlineTable";

export default function AdminExport() {
  const { clients, template, lCD } = useApp();
  const [sel, setSel] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async c => {
    setSel(c); setLoading(true);
    const d = await lCD(c.slug);
    setData(d); setLoading(false);
  };

  const handleJSON = () => {
    exportJSON(
      { client: { name: sel.name, slug: sel.slug }, template, data },
      `recueil-${sel.slug}.json`
    );
  };

  const handleXLSX = () => {
    exportExcel(template, data, `recueil-${sel.slug}.xlsx`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">Export des recueils</h2>
        <p className="text-slate-500 text-sm mt-1">Sélectionnez un client pour voir et exporter ses réponses</p>
      </div>

      {!clients.length ? (
        <Empty icon={Download} title="Aucun client" desc="Créez un client pour pouvoir exporter" />
      ) : (
        <>
          {/* Client selector */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {clients.map(c => (
              <button key={c.slug} onClick={() => load(c)}
                className={`p-4 rounded-xl border text-left transition-all ${sel?.slug === c.slug ? "border-[#1a1f6c] bg-[#1a1f6c]/5 shadow-md ring-2 ring-[#1a1f6c]/20" : "border-slate-200 hover:border-slate-300 bg-white"}`}>
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#1a1f6c] to-[#4e54c8] flex items-center justify-center text-white font-bold mb-2">{c.name[0]}</div>
                <div className="font-semibold text-slate-900 text-sm">{c.name}</div>
                <div className="text-xs text-slate-500 font-mono">{c.slug}</div>
              </button>
            ))}
          </div>

          {loading && <div className="flex justify-center py-8"><Clock size={24} className="animate-spin text-slate-400" /></div>}

          {/* Data preview + export buttons */}
          {sel && !loading && data && (
            <Card className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-slate-800">
                  Données de <span className="text-[#1a1f6c]">{sel.name}</span>
                </h3>
                <div className="flex gap-3">
                  <Btn onClick={handleXLSX}><FileSpreadsheet size={16} /> Excel</Btn>
                  <Btn v="secondary" onClick={handleJSON}><FileJson size={16} /> JSON</Btn>
                </div>
              </div>

              {template.pages.map(pg => {
                const pd = data[pg.id] || {};
                const tables = pg.blocks.filter(b => b.type === "table");
                if (!tables.length) return null;
                return (
                  <div key={pg.id} className="space-y-3">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-1">{pg.title}</div>
                    {tables.map(bl => {
                      const rows = pd[bl.id]?.rows || bl.content?.defaultRows || [];
                      const cols = bl.content?.columns || [];
                      return (
                        <div key={bl.id}>
                          {bl.content?.title && <div className="text-sm font-semibold text-slate-700 mb-1">{bl.content.title}</div>}
                          <InlineTable columns={cols} rows={rows} edit={false} />
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </Card>
          )}
        </>
      )}
    </div>
  );
}
