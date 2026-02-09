import { useApp } from "../../context/AppContext";
import { SectionHeader, DataTable } from "../ui";
import { YES_NO } from "../../config/options";
import { uid } from "../../config/defaults";

export default function Documents() {
  const { docModels, setDocModels, updateItem, removeItem } = useApp();
  const update = updateItem(setDocModels);
  const remove = removeItem(setDocModels);
  const add = () => setDocModels(prev => [...prev, { id: uid("dm"), name: "", target: "Tous les utilisateurs", generator: "", uploaded: "Non", spName: "" }]);

  const columns = [
    { key: "name", label: "Nom du document", minWidth: "200px", type: "text", inputClass: "font-medium", placeholder: "Nom" },
    { key: "target", label: "Qui est concerné", minWidth: "160px", type: "text", placeholder: "Population" },
    { key: "generator", label: "Qui peut générer", minWidth: "180px", type: "text", placeholder: "Rôle(s)" },
    { key: "uploaded", label: "Déposé dans SharePoint", minWidth: "100px", center: true, type: "select", options: YES_NO },
    { key: "spName", label: "Nom dans SharePoint", minWidth: "160px", type: "text", placeholder: "Nom du fichier" },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader title="6b. Modèles de documents" subtitle="Configurez les modèles de documents générables par les collaborateurs et RH" />
      <DataTable columns={columns} data={docModels} onUpdate={update} onDelete={remove} onAdd={add} addLabel="Ajouter un modèle" />
    </div>
  );
}
