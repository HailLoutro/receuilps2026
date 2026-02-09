// ━━━ CELL DISPLAY ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FIX #3 : première ligne = texte principal, lignes suivantes = sous-texte en italique

export default function CellDisplay({ value }) {
  if (!value) return <span className="text-slate-300">—</span>;
  const str = String(value);
  const idx = str.indexOf("\n");
  if (idx === -1) return <span>{str}</span>;
  return (
    <div>
      <div className="font-medium">{str.substring(0, idx)}</div>
      <div className="text-xs text-slate-400 italic mt-0.5 leading-snug">{str.substring(idx + 1)}</div>
    </div>
  );
}
