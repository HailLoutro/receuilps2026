// ━━━ ADMIN BACKUPS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FIX #5: sauvegarde/restauration du template
import { useState } from "react";
import { Save, RotateCcw, Archive } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Btn, Inp, Card, Empty } from "../../components/ui";

export default function AdminBackups() {
  const { backups, backupTpl, restoreTpl, template } = useApp();
  const [label, setLabel] = useState("");

  const save = () => { backupTpl(label); setLabel(""); };
  const totalBlocks = template.pages?.reduce((a, p) => a + p.blocks.length, 0) || 0;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-extrabold text-slate-900">Sauvegardes du template</h2>

      <Card className="p-5 space-y-4">
        <p className="text-sm text-slate-600">
          Sauvegardez l'état actuel du template avant une modification importante. Vous pourrez le restaurer à tout moment.
        </p>
        <div className="flex gap-3">
          <Inp value={label} onChange={setLabel} ph="Nom de la sauvegarde (optionnel)" className="flex-1" />
          <Btn onClick={save}><Save size={16} /> Sauvegarder</Btn>
        </div>
        <p className="text-xs text-slate-400">
          Template actuel : {template.pages?.length || 0} pages, {totalBlocks} blocs
        </p>
      </Card>

      {backups.length === 0 ? (
        <Empty icon={Archive} title="Aucune sauvegarde" desc="Créez votre première sauvegarde ci-dessus" />
      ) : (
        <div className="grid gap-3">
          {backups.map(b => (
            <Card key={b.id} className="p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-900 text-sm">{b.label}</div>
                <div className="text-xs text-slate-500">
                  {new Date(b.createdAt).toLocaleString("fr-FR")} — {b.template.pages?.length} pages, {b.template.pages?.reduce((a, p) => a + p.blocks.length, 0)} blocs
                </div>
              </div>
              <Btn v="secondary" s="sm" onClick={() => {
                if (confirm(`Restaurer "${b.label}" ?\nLe template actuel sera remplacé.`)) restoreTpl(b.id);
              }}>
                <RotateCcw size={14} /> Restaurer
              </Btn>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
