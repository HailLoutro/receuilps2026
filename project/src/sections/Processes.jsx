import { useApp } from "../../context/AppContext";
import { SectionHeader, InfoBox, DataTable } from "../ui";
import { YES_NO, INITIATOR_OPTIONS, STANDARD_ROLES } from "../../config/options";
import { uid } from "../../config/defaults";

export default function Processes() {
  const { processes, setProcesses, customProcesses, setCustomProcesses, roleNames, updateItem, removeItem } = useApp();

  const updateP = updateItem(setProcesses);
  const removeP = removeItem(setProcesses);
  const updateCP = updateItem(setCustomProcesses);
  const removeCP = removeItem(setCustomProcesses);

  const addProcess = () => setProcesses(prev => [...prev, {
    id: uid("p"), name: "", description: "", target: "Tous les utilisateurs",
    initiator: "", validator2: "", validator3: "", keep: "Oui", notification: "Non", notifyWho: "",
  }]);

  const addCustom = () => setCustomProcesses(prev => [...prev, {
    id: uid("cp"), name: "", description: "", target: "",
    initiator: "", validator2: "", validator3: "", keep: "Oui", notification: "Non", notifyWho: "",
  }]);

  const validatorOptions = ["", "Manager", "RH", "Assistant(e) RH", ...roleNames.filter(r => !STANDARD_ROLES.includes(r))];

  const columns = [
    { key: "name", label: "Nom du formulaire", minWidth: "200px", type: "text", inputClass: "font-medium", placeholder: "Nom" },
    { key: "description", label: "Description", minWidth: "200px", type: "text", placeholder: "Description" },
    { key: "target", label: "Population", minWidth: "120px", type: "text", placeholder: "Population cible" },
    { key: "initiator", label: "Initiateur", minWidth: "110px", type: "select", options: INITIATOR_OPTIONS },
    { key: "validator2", label: "Validation 2", minWidth: "110px", type: "select", options: validatorOptions },
    { key: "validator3", label: "Validation 3", minWidth: "110px", type: "select", options: validatorOptions },
    { key: "keep", label: "Conserver", minWidth: "80px", center: true, type: "check", color: "green" },
    { key: "notification", label: "Notif.", minWidth: "70px", type: "select", options: YES_NO },
    { key: "notifyWho", label: "Qui informer", minWidth: "120px", type: "text", placeholder: "Rôle/nom", disabled: item => item.notification !== "Oui" },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader title="4. Processus & Workflows" subtitle="Configurez les formulaires et circuits de validation" />
      <InfoBox type="tip">
        <strong>Conseil :</strong> Notez tous les jours les actions que vous réalisez dans le cadre de votre activité courante RH. Quels sont les processus entraînant le plus de doubles saisies ? Quels échanges nécessitent une validation ?
      </InfoBox>

      <div>
        <h3 className="font-bold text-slate-800 mb-3">Formulaires standards</h3>
        <DataTable columns={columns} data={processes} onUpdate={updateP} onDelete={removeP} onAdd={addProcess} addLabel="Ajouter un formulaire standard" />
      </div>

      <div>
        <h3 className="font-bold text-slate-800 mb-3">Besoins spécifiques</h3>
        <DataTable columns={columns} data={customProcesses} onUpdate={updateCP} onDelete={removeCP} onAdd={addCustom} addLabel="Ajouter un processus spécifique" addColor="amber" headerClass="bg-amber-50" />
      </div>
    </div>
  );
}
