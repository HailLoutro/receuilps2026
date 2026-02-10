// ━━━ ROLE HELPERS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//
// Ce module gère la propagation automatique des rôles :
//   1. Extraction des noms de rôles depuis le tableau "roleSource"
//   2. Enrichissement des colonnes avec roleCols / roleOptions
//
// Utilisé côté CLIENT (rendu), ADMIN (preview), EXPORT (Excel/JSON)
//

/**
 * Extrait la liste des noms de rôles depuis le template + données client.
 * Cherche le bloc avec roleSource: true, lit les lignes client (ou default).
 */
export function extractRoles(template, clientData = {}) {
  if (!template?.pages) return [];
  for (const page of template.pages) {
    for (const block of (page.blocks || [])) {
      if (block.type === "table" && block.content?.roleSource) {
        const pd = clientData[page.id] || {};
        const bd = pd[block.id];
        const rows = bd?.rows || block.content.defaultRows || [];
        return rows.map(r => r.name || "").filter(Boolean);
      }
    }
  }
  return [];
}

/**
 * Enrichit les colonnes d'un bloc selon ses markers :
 *   roleCols: "check"               → ajoute 1 colonne check par rôle
 *   roleCols: "select:Opt1|Opt2"    → ajoute 1 colonne select par rôle
 *   roleOptions: true               → injecte les rôles dans les options de toutes les colonnes select
 */
export function enrichColumns(baseColumns, blockContent, roles) {
  if (!blockContent || !roles.length) return baseColumns;
  let cols = [...baseColumns];

  // ── roleCols : ajouter des colonnes dynamiques ─────────────
  if (blockContent.roleCols) {
    const parts = blockContent.roleCols.split(":");
    const colType = parts[0]; // "check" ou "select"
    const optsRaw = parts[1] || ""; // "Modifier|Voir|Masquer"
    const opts = optsRaw.replace(/\|/g, ", ");

    for (const role of roles) {
      const key = `_role_${slugify(role)}`;
      // Ne pas ajouter si déjà présent
      if (cols.find(c => c.key === key)) continue;
      cols.push({
        key,
        label: role,
        type: colType === "select" ? "select" : "check",
        minWidth: colType === "select" ? "120px" : "90px",
        options: opts,
        _dynamic: true, // marqueur pour l'UI
      });
    }

    // Nettoyer les colonnes dynamiques dont le rôle n'existe plus
    cols = cols.filter(c => {
      if (!c._dynamic) return true;
      const roleSlug = c.key.replace("_role_", "");
      return roles.some(r => slugify(r) === roleSlug);
    });
  }

  // ── roleOptions : injecter les rôles dans les selects ──────
  if (blockContent.roleOptions) {
    cols = cols.map(c => {
      if (c.type === "select") {
        const existing = (c.options || "").split(",").map(s => s.trim()).filter(Boolean);
        // Rôles en premier, puis les options existantes (sans doublon)
        const merged = [...roles, ...existing.filter(e => !roles.includes(e))];
        return { ...c, options: merged.join(", ") };
      }
      return c;
    });
  }

  return cols;
}

/**
 * Fusionne les colonnes du template + colonnes ajoutées par le client (extraCols),
 * puis applique l'enrichissement de rôles.
 */
export function getFullColumns(block, blockData, roles) {
  const content = block.content || {};
  const baseCols = content.columns || [];
  const extraCols = blockData?.extraCols || [];
  const allCols = [...baseCols, ...extraCols];
  return enrichColumns(allCols, content, roles);
}

/**
 * Récupère les lignes à afficher : client data > default rows
 */
export function getRows(block, blockData) {
  return blockData?.rows || (block.content?.defaultRows || []).map(r => ({ ...r }));
}

// ── Helpers privés ───────────────────────────────────────────
function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/(^_|_$)/g, "");
}
