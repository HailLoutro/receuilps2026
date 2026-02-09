import { useApp } from "../../context/AppContext";
import { SectionHeader, InfoBox, DataTable } from "../ui";
import { uid } from "../../config/defaults";

export default function PSO() {
  const { pso, setPso, updateItem, removeItem } = useApp();
  const update = updateItem(setPso);
  const remove = removeItem(setPso);
  const add = () => setPso(prev => [...prev, { id: uid("pso"), name: "", objective: "", forms: "", roles: "", population: "Tous", group: "", criteria: "", responsible: "Admin" }]);

  const columns = [
    { key: "name", label: "Nom", minWidth: "140px", type: "text", inputClass: "font-medium", placeholder: "Nom du PSO" },
    { key: "objective", label: "Objectif du PSO", minWidth: "240px", type: "text", placeholder: "Objectif" },
    { key: "forms", label: "Formulaire(s) associé(s)", minWidth: "160px", type: "text", placeholder: "Formulaires" },
    { key: "roles", label: "Rôle(s) associé(s)", minWidth: "200px", type: "text", placeholder: "Rôles" },
    { key: "population", label: "Population", minWidth: "100px", type: "text", placeholder: "Population" },
    { key: "group", label: "Groupe", minWidth: "120px", type: "text", placeholder: "Groupe" },
    { key: "criteria", label: "Critère d'attribution", minWidth: "160px", type: "text", placeholder: "Critère" },
    { key: "responsible", label: "Responsable", minWidth: "100px", type: "text", placeholder: "Admin" },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader title="8. PSO (Objets organisationnels)" subtitle="Configurez les PSO de votre organisation (Utilisateur, Poste, Site, Service, etc.)" />
      <InfoBox>
        Les PSO permettent de structurer votre organisation. Par défaut, PeopleSpheres propose des PSO standards (Utilisateur, Poste, Site, Service, Centre de coût, etc.) que vous pouvez personnaliser.
      </InfoBox>
      <DataTable columns={columns} data={pso} onUpdate={update} onDelete={remove} onAdd={add} addLabel="Ajouter un PSO" />
    </div>
  );
}
