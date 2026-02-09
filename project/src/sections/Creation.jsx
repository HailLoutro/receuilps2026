import { useApp } from "../../context/AppContext";
import { SectionHeader, InfoBox, DataTable } from "../ui";
import { YES_NO } from "../../config/options";

export default function Creation() {
  const { profileFields, setProfileFields, updateItem } = useApp();
  const update = updateItem(setProfileFields);

  const creationFields = profileFields.filter(f => f.present === "Oui");

  const columns = [
    { key: "field", label: "Champ", minWidth: "200px", type: "custom", render: item => <span className="font-medium text-slate-700">{item.field}</span> },
    { key: "subfield", label: "Sous-champ", minWidth: "140px", type: "custom", render: item => <span className="text-slate-500">{item.subfield || "—"}</span> },
    { key: "inCreation", label: "Dans le formulaire", minWidth: "100px", center: true, type: "select", options: YES_NO },
    { key: "prefilled", label: "Prérempli", minWidth: "80px", center: true, type: "select", options: YES_NO },
    { key: "prefilledValue", label: "Valeur si prérempli", minWidth: "140px", type: "text", placeholder: "Valeur", disabled: item => item.prefilled !== "Oui" },
    { key: "required", label: "Obligatoire", minWidth: "80px", center: true, type: "select", options: YES_NO },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader title="3b. Création d'utilisateur" subtitle="Configurez le formulaire de création d'un nouveau collaborateur" />
      <InfoBox>Les champs affichés ci-dessous sont ceux marqués comme « Présent » dans le profil utilisateur (section 3a).</InfoBox>
      <DataTable columns={columns} data={creationFields} onUpdate={update} rowHighlight />
    </div>
  );
}
