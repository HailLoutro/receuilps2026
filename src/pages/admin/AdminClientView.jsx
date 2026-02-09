// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ADMIN CLIENT VIEW — Voir les réponses + Export
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { useState, useEffect } from "react";
import { ChevronLeft, FileJson, FileSpreadsheet, Clock } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { exportJSON, exportExcel } from "../../services/export";
import { Btn, Card } from "../../components/ui";
import InlineTable from "../../components/editor/InlineTable";

export default function AdminClientView({ client, onBack }) {
  const { template, loadClientData } = useApp();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const d = await loadClientData(client.slug);
      setData(d);
      setLoading(false);
    })();
  }, [client.slug]);

  const handleExportJSON = () => {
    exportJSON({ client, template, data }, `recueil-${client.slug}.json`);
  };

  const handleExportExcel = () => {
    exportExcel(template, data, `recueil-${client.slug}.xlsx`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Clock size={24} className="animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Btn variant="ghost" size="sm" onClick={onBack}>
            <ChevronLeft size={16} /> Retour
          </Btn>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">{client.name}</h2>
            <p className="text-xs text-slate-500">Réponses au recueil</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Btn variant="secondary" size="sm" onClick={handleExportJSON}>
            <FileJson size={16} /> JSON
          </Btn>
          <Btn variant="secondary" size="sm" onClick={handleExportExcel}>
            <FileSpreadsheet size={16} /> Excel
          </Btn>
        </div>
      </div>

      {/* Tables by page */}
      {template.pages.map((page) => {
        const pageData = data?.[page.id] || {};
        const tableBlocks = page.blocks.filter((b) => b.type === "table");
        if (!tableBlocks.length) return null;

        return (
          <Card key={page.id} className="overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200">
              <h3 className="font-bold text-slate-800">{page.title}</h3>
            </div>
            <div className="p-4 space-y-4">
              {tableBlocks.map((block) => {
                const rows = pageData[block.id]?.rows || block.content?.defaultRows || [];
                const cols = block.content?.columns || [];
                return (
                  <div key={block.id}>
                    {block.content?.title && (
                      <h4 className="font-semibold text-slate-700 mb-2 text-sm">
                        {block.content.title}
                      </h4>
                    )}
                    <InlineTable columns={cols} rows={rows} edit={false} />
                  </div>
                );
              })}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
