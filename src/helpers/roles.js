// ━━━ ROLE HELPERS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//
// ARCHITECTURE DES RÔLES :
//
//   Template (admin)  → defaultRows dans le bloc roleSource = "rôles standards"
//                        → Tous les clients démarrent avec ces rôles
//
//   Client data       → Chaque client a SA copie des lignes de rôles
//                        → Il peut ajouter/supprimer des rôles
//                        → Ses rôles sont indépendants des autres clients
//
//   Propagation       → roleCols / roleOptions enrichissent dynamiquement
//                        les colonnes des autres tableaux
//                        → Suppression d'un rôle = colonne supprimée partout
//

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/(^_|_$)/g, "");

/**
 * Trouve le bloc roleSource dans le template
 */
function findRoleSourceBlock(template) {
  if (!template?.pages) return null;
  for (const page of template.pages) {
    for (const block of (page.blocks || [])) {
      if (block.type === "table" && block.content?.roleSource) {
        return { page, block };
      }
    }
  }
  return null;
}

/**
 * Rôles STANDARDS définis par l'admin dans le template.
 * Utilisé pour : affichage admin, valeurs par défaut des nouveaux clients.
 */
export function extractTemplateRoles(template) {
  const found = findRoleSourceBlock(template);
  if (!found) return [];
  const rows = found.block.content.defaultRows || [];
  return rows.map(r => r.name || "").filter(Boolean);
}

/**
 * Rôles SPÉCIFIQUES d'un client.
 * Lit les données client en priorité, sinon retombe sur les standards.
 * Chaque client a sa propre liste de rôles.
 */
export function extractClientRoles(template, clientData) {
  const found = findRoleSourceBlock(template);
  if (!found) return [];

  const { page, block } = found;
  const pageData = clientData?.[page.id] || {};
  const blockData = pageData[block.id];

  // Si le client a SES propres données → utiliser SES rôles
  if (blockData?.rows) {
    return blockData.rows.map(r => r.name || "").filter(Boolean);
  }

  // Sinon → rôles standards du template
  return (block.content.defaultRows || []).map(r => r.name || "").filter(Boolean);
}

/**
 * Enrichit les colonnes d'un bloc avec les rôles :
 *   roleCols: "check"               → 1 colonne check par rôle
 *   roleCols: "select:Opt1|Opt2"    → 1 colonne select par rôle
 *   roleOptions: true               → injecte les rôles dans les selects existants
 *
 * SUPPRESSION AUTOMATIQUE : si un rôle n'existe plus,
 * sa colonne dynamique disparaît automatiquement.
 */
export function enrichColumns(baseColumns, blockContent, roles) {
  if (!blockContent) return baseColumns;
  let cols = [...baseColumns];

  if (blockContent.roleCols && roles.length) {
    const parts = blockContent.roleCols.split(":");
    const colType = parts[0]; // "check" ou "select"
    const optsRaw = parts[1] || "";
    const opts = optsRaw.replace(/\|/g, ", ");

    // Ajouter les colonnes pour les rôles actuels
    for (const role of roles) {
      const key = `_role_${slugify(role)}`;
      if (!cols.find(c => c.key === key)) {
        cols.push({
          key,
          label: role,
          type: colType === "select" ? "select" : "check",
          minWidth: colType === "select" ? "120px" : "90px",
          options: opts,
          _dynamic: true,
        });
      }
    }

    // SUPPRIMER les colonnes dont le rôle n'existe plus
    cols = cols.filter(c => {
      if (!c._dynamic) return true;
      const roleSlug = c.key.replace("_role_", "");
      return roles.some(r => slugify(r) === roleSlug);
    });
  }

  if (blockContent.roleOptions) {
    cols = cols.map(c => {
      if (c.type !== "select") return c;
      // Supprimer les anciennes options de rôle, puis ajouter les actuels
      const staticOpts = (c._staticOptions || c.options || "")
        .split(",").map(s => s.trim()).filter(Boolean);
      // Sauvegarder les options statiques pour ne pas les perdre
      const merged = [...roles, ...staticOpts.filter(o => !roles.includes(o))];
      return { ...c, options: merged.join(", "), _staticOptions: staticOpts.join(", ") };
    });
  }

  return cols;
}

/**
 * Colonnes complètes : template + client extraCols + enrichissement rôles
 */
export function getFullColumns(block, blockData, roles) {
  const content = block.content || {};
  const baseCols = content.columns || [];
  const extraCols = blockData?.extraCols || [];
  return enrichColumns([...baseCols, ...extraCols], content, roles);
}

/**
 * Lignes : données client > lignes par défaut
 */
export function getRows(block, blockData) {
  return blockData?.rows || (block.content?.defaultRows || []).map(r => ({ ...r }));
}

/**
 * Info sur le bloc roleSource (pour l'UI admin)
 */
export function getRoleSourceInfo(template) {
  return findRoleSourceBlock(template);
}
