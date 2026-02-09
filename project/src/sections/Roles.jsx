import { useApp } from "../../context/AppContext";
import { SectionHeader, InfoBox, DataTable, Badge, AddColButton } from "../ui";
import { YES_NO, SENSITIVITY_OPTIONS } from "../../config/options";
import { uid } from "../../config/defaults";

export default function Roles() {
  const { roles, setRoles, customRoleCols, setCustomRoleCols, updateItem, removeItem } = useApp();

  const update = updateItem(setRoles);
  const remove = removeItem(setRoles);

  const addRole = () => setRoles(prev => [...prev, {
    id: uid("r"), standard: false, name: "", seeData: "", accessFeatures: "",
    validateProcesses: "", assignment: "", population: "", domains: "", sensitivity: "",
  }]);

  const addCol = () => {
    const name = prompt("Nom de la nouvelle colonne :");
    if (name?.trim()) setCustomRoleCols(prev => [...prev, name.trim()]);
  };

  const columns = [
    { key: "standard", label: "Std", minWidth: "50px", type: "badge", render: item => item.standard ? <Badge color="blue">Oui</Badge> : <Badge color="gray">Non</Badge> },
    { key: "name", label: "Nom du rôle", minWidth: "160px", type: "text", inputClass: "font-medium", placeholder: "Nom du rôle" },
    { key: "seeData", label: "Voir données", minWidth: "100px", type: "select", options: YES_NO },
    { key: "accessFeatures", label: "Fonctionnalités", minWidth: "100px", type: "select", options: YES_NO },
    { key: "validateProcesses", label: "Valider processus", minWidth: "100px", type: "select", options: YES_NO },
    { key: "assignment", label: "Assignation", minWidth: "200px", type: "text", placeholder: "Assignation du rôle" },
    { key: "population", label: "Population cible", minWidth: "160px", type: "text", placeholder: "Population" },
    { key: "sensitivity", label: "Sensibilité", minWidth: "140px", type: "select", options: SENSITIVITY_OPTIONS },
    ...customRoleCols.map(c => ({ key: c, label: c, minWidth: "140px", type: "text" })),
  ];

  return (
    <div className="space-y-6">
      <SectionHeader title="1. Rôles & Accès aux champs" subtitle="Définissez les rôles nécessaires pour votre organisation" />
      <InfoBox>
        <strong>Questions à se poser :</strong> Quelle personne pourrait être amenée à valider des formulaires dans PeopleSpheres ? Qui doit voir les données des collaborateurs et en modifier ? Qui peut réaliser des exports de données ?
      </InfoBox>
      <DataTable
        columns={columns}
        data={roles}
        onUpdate={update}
        onDelete={remove}
        onAdd={addRole}
        addLabel="Ajouter un rôle"
        extraHeaderRight={<AddColButton onClick={addCol} />}
      />
    </div>
  );
}
