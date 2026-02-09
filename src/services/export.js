// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EXPORT SERVICE — Export JSON & Excel
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import * as XLSX from "xlsx";

/**
 * Télécharge un objet JSON en fichier.
 */
export function exportJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  downloadBlob(blob, filename);
}

/**
 * Exporte les données du recueil en fichier Excel.
 * Chaque tableau = un onglet.
 */
export function exportExcel(template, clientData, filename) {
  const wb = XLSX.utils.book_new();

  (template.pages || []).forEach((page) => {
    const tableBlocks = page.blocks.filter((b) => b.type === "table");

    tableBlocks.forEach((block, bi) => {
      const cols = block.content?.columns || [];
      const rows =
        clientData?.[page.id]?.[block.id]?.rows ||
        block.content?.defaultRows ||
        [];

      // Header row + data rows
      const wsData = [
        cols.map((c) => c.label),
        ...rows.map((row) => cols.map((c) => row[c.key] || "")),
      ];

      const ws = XLSX.utils.aoa_to_sheet(wsData);

      // Largeurs automatiques
      ws["!cols"] = cols.map((c) => ({
        wch: Math.max(
          c.label.length,
          ...rows.map((r) => String(r[c.key] || "").length)
        ) + 2,
      }));

      // Nom de l'onglet (max 31 caractères, unique)
      const sheetName = `${(page.title || "Page").substring(0, 22)}_${bi + 1}`
        .substring(0, 31)
        .replace(/[\\/*?[\]]/g, "");

      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    });
  });

  XLSX.writeFile(wb, filename);
}

// ── Helper ───────────────────────────────────────────────────

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
