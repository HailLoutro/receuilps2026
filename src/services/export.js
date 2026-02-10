// ━━━ EXPORT SERVICE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FIX #3 : subtitle handling in export (line breaks → " — ")
// Role columns + extra columns included

import { extractClientRoles, getFullColumns, getRows } from "../helpers/roles";

/**
 * Build a flat array of sheet-ready data for a given client.
 * Each entry: { sheetName, header, rows }
 */
export function buildExportSheets(template, clientData) {
  const roles = extractClientRoles(template, clientData);
  const sheets = [];

  for (const page of (template.pages || [])) {
    const pd = clientData[page.id] || {};
    const tables = page.blocks.filter(b => b.type === "table");

    tables.forEach((block, bi) => {
      const bd = pd[block.id] || {};
      const cols = getFullColumns(block, bd, roles);
      const rows = getRows(block, bd);

      const header = cols.map(c => c.label);
      const data = rows.map(r =>
        cols.map(c => {
          const v = r[c.key] || "";
          return typeof v === "string" ? v.replace(/\n/g, " — ") : v;
        })
      );

      const sheetName = `${(page.title || "P").substring(0, 22)}_${bi + 1}`
        .substring(0, 31).replace(/[\\/*?[\]]/g, "");

      sheets.push({ sheetName, header, data, pageTitle: page.title, blockTitle: block.content?.title });
    });
  }

  return sheets;
}
