// ━━━ EXPORT SERVICE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
import * as XLSX from "xlsx";

export function exportJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  download(blob, filename);
}

export function exportExcel(template, clientData, filename) {
  const wb = XLSX.utils.book_new();

  (template.pages || []).forEach(page => {
    page.blocks.filter(b => b.type === "table").forEach((block, bi) => {
      const cols = block.content?.columns || [];
      const rows = clientData?.[page.id]?.[block.id]?.rows || block.content?.defaultRows || [];

      // FIX #3: newlines → " — " dans l'export
      const wsData = [
        cols.map(c => c.label),
        ...rows.map(row => cols.map(c => {
          const v = row[c.key] || "";
          return typeof v === "string" ? v.replace(/\n/g, " — ") : v;
        })),
      ];

      const ws = XLSX.utils.aoa_to_sheet(wsData);
      ws["!cols"] = cols.map(c => ({ wch: Math.max(c.label.length, 12) + 2 }));

      const name = `${(page.title || "P").substring(0, 22)}_${bi + 1}`
        .substring(0, 31)
        .replace(/[\\/*?[\]]/g, "");

      XLSX.utils.book_append_sheet(wb, ws, name);
    });
  });

  XLSX.writeFile(wb, filename);
}

function download(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
