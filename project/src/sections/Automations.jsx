import { useApp } from "../../context/AppContext";
import { SectionHeader, InfoBox, DataTable } from "../ui";
import { ALERT_TYPES } from "../../config/options";
import { uid } from "../../config/defaults";

export default function Automations() {
  const { automations, setAutomations, customAutomations, setCustomAutomations, updateItem, removeItem } = useApp();

  const updateA = updateItem(setAutomations);
  const removeA = removeItem(setAutomations);
  const updateCA = updateItem(setCustomAutomations);
  const removeCA = removeItem(setCustomAutomations);

  const addA = () => setAutomations(prev => [...prev, {
    id: uid("a"), theme: "", name: "", objective: "", who: "", timing: "", alertType: "Mail", keep: "Non",
  }]);
  const addCA = () => setCustomAutomations(prev => [...prev, {
    id: uid("ca"), theme: "", name: "", objective: "", who: "", timing: "", alertType: "Mail", keep: "Non",
  }]);

  const columns = [
    { key: "theme", label: "Thématique", minWidth: "120px", type: "text", placeholder: "Thématique" },
    { key: "name", label: "Nom de la règle", minWidth: "180px", type: "text", inputClass: "font-medium", placeholder: "Nom" },
    { key: "objective", label: "Objectif", minWidth: "250px", type: "text", placeholder: "Objectif de la règle" },
    { key: "who", label: "Qui est alerté", minWidth: "140px", type: "text", placeholder: "Rôle(s)" },
    { key: "timing", label: "Temporalité", minWidth: "180px", type: "text", placeholder: "Quand ?" },
    { key: "alertType", label: "Type d'alerte", minWidth: "100px", type: "select", options: ALERT_TYPES },
    { key: "keep", label: "Conserver", minWidth: "80px", center: true, type: "check", color: "green" },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader title="5. Automatisations & Alertes" subtitle="Configurez les règles d'automatisation et notifications" />
      <InfoBox>
        <strong>Questions :</strong> Quels sont les rappels que vous réalisez par mail ? Quels sont vos process pouvant répondre à une règle de gestion ? (ex: SI Cadre ET arrivé il y a 6 mois ALORS envoyer un mail)
      </InfoBox>

      <div>
        <h3 className="font-bold text-slate-800 mb-3">Automatisations standards</h3>
        <DataTable columns={columns} data={automations} onUpdate={updateA} onDelete={removeA} onAdd={addA} addLabel="Ajouter une règle standard" />
      </div>

      <div>
        <h3 className="font-bold text-slate-800 mb-3">Automatisations spécifiques</h3>
        <DataTable columns={columns} data={customAutomations} onUpdate={updateCA} onDelete={removeCA} onAdd={addCA} addLabel="Ajouter une règle spécifique" addColor="amber" headerClass="bg-amber-50" />
      </div>
    </div>
  );
}
