import { useApp } from "../../context/AppContext";
import { SectionHeader, InfoBox, DataTable } from "../ui";
import { uid } from "../../config/defaults";

export default function Groups() {
  const { groups, setGroups, updateItem, removeItem } = useApp();
  const update = updateItem(setGroups);
  const remove = removeItem(setGroups);
  const add = () => setGroups(prev => [...prev, { id: uid("g"), name: "", pso: "Utilisateur", domain: "Domaine global utilisateur", constitution: "", specific: "" }]);

  const columns = [
    { key: "name", label: "Nom", minWidth: "180px", type: "text", inputClass: "font-medium", placeholder: "Nom du groupe" },
    { key: "pso", label: "PSO", minWidth: "120px", type: "text", placeholder: "Utilisateur" },
    { key: "domain", label: "Domaine", minWidth: "160px", type: "text", placeholder: "Domaine" },
    { key: "constitution", label: "Constitution / Description", minWidth: "280px", type: "text", placeholder: "Condition ou description du groupe" },
    { key: "specific", label: "Utilisateurs spécifiques", minWidth: "160px", type: "text", placeholder: "Noms" },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader title="5b. Groupes d'utilisateurs" subtitle="Définissez les groupes pour le ciblage des actualités, formulaires, et widgets" />
      <InfoBox>
        <strong>Questions :</strong> À quel(s) groupe(s) de collaborateurs souhaitez-vous partager une actualité ?
        À quelle(s) population(s) souhaitez-vous affecter un formulaire en self-service ?
      </InfoBox>
      <DataTable columns={columns} data={groups} onUpdate={update} onDelete={remove} onAdd={add} addLabel="Ajouter un groupe" />
    </div>
  );
}
