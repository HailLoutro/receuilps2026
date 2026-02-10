// ━━━ ADMIN EXPORT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FIX #3 : l'export inclut les lignes/colonnes ajoutées par le client
//          + les colonnes dynamiques de rôle
import { useState } from "react";
import {
  Download, FileSpreadsheet, FileJson, Clock, Users,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Btn, Card, Empty } from "../../components/ui";
import InlineTable from "../../components/editor/InlineTable";
import { extractRoles, getFullColumns, getRows } from "../../helpers/roles";
import * as DB from "../../services/database";

export default function AdminExport() {
  const { clients, template } = useApp();
  const [sel, setSel] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async c => {
    setSel(c); setLoading(true);
    const d = await DB.getClientData(c.slug);
    setData(d);
    setLoading(false);
  };

  const getRoles = () => extractRoles(template, data || {});

  // ── Export JSON ────────────────────────────────────────────
  const expJSON = () => {
    const roles = getRoles();
    const exportData = { client: { name: sel.name, slug: sel.slug }, template, clientData: data, roles, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `recueil-${sel.slug}.json`; a.click(); URL.revokeObjectURL(url);
  };

  // ── Export Excel ───────────────────────────────────────────
  const expXLSX = async () => {
    // Dynamic import SheetJS
    const XLSX = await import("xlsx");
    const wb = XLSX.utils.book_new();
    const roles = getRoles();

    template.pages.forEach(pg => {
      const pd = data?.[pg.id] || {};
      pg.blocks.filter(b => b.type === "table").forEach((bl, bi) => {
        const bd = pd[bl.id] || {};
        const cols = getFullColumns(bl, bd, roles);
        const rows = getRows(bl, bd);

        // En-têtes
        const header = cols.map(c => c.label);
        // Données
        const rowData = rows.map(r =>
          cols.map(c => {
            const v = r[c.key] || "";
            return typeof v === "string" ? v.replace(/\n/g, " — ") : v;
          })
        );

        const ws = XLSX.utils.aoa_to_sheet([header, ...rowData]);
        ws["!cols"] = cols.map(c => ({ wch: Math.max(String(c.label).length, 12) + 2 }));

        const sheetName = `${(pg.title || "P").substring(0, 22)}_${bi + 1}`
          .substring(0, 31).replace(/[\\/*?[\]]/g, "");
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
      });
    });

    XLSX.writeFile(wb, `recueil-${sel.slug}.xlsx`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">Export des recueils</h2>
        <p className="text-slate-500 text-sm mt-1">Sélectionnez un client pour visualiser et exporter ses données</p>
      </div>

      {!clients.length ? (
        <Empty icon={Download} title="Aucun client" desc="Créez un client d'abord" />
      ) : <>
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

        {sel && !loading && data && (
          <Card className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-slate-800">
                  Données de <span className="text-[#1a1f6c]">{sel.name}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {getRoles().length} rôle(s) détecté(s) — inclus dans l'export
                </p>
              </div>
              <div className="flex gap-3">
                <Btn onClick={expXLSX}><FileSpreadsheet size={16} /> Excel</Btn>
                <Btn v="secondary" onClick={expJSON}><FileJson size={16} /> JSON</Btn>
              </div>
            </div>

            {template.pages.map(pg => {
              const pd = data[pg.id] || {};
              const tables = pg.blocks.filter(b => b.type === "table");
              if (!tables.length) return null;
              const roles = getRoles();
              return (
                <div key={pg.id} className="space-y-3">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-1">{pg.title}</div>
                  {tables.map(bl => {
                    const bd = pd[bl.id] || {};
                    const cols = getFullColumns(bl, bd, roles);
                    const rows = getRows(bl, bd);
                    return (
                      <div key={bl.id}>
                        {bl.content?.title && <div className="text-sm font-semibold text-slate-700 mb-1">{bl.content.title}</div>}
                        {bd.extraCols?.length > 0 && (
                          <div className="text-[10px] text-blue-600 mb-1">+ {bd.extraCols.length} colonne(s) ajoutée(s) par le client</div>
                        )}
                        <InlineTable columns={cols} rows={rows} edit={false} />
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </Card>
        )}
      </>}
    </div>
  );
}
