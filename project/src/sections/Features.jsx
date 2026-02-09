import { useApp } from "../../context/AppContext";
import { SectionHeader, DataTable, CheckToggle } from "../ui";
import { STANDARD_ROLES } from "../../config/options";
import { uid } from "../../config/defaults";

export default function Features() {
  const { featureAccess, setFeatureAccess, roles, updateItem, removeItem } = useApp();

  const update = updateItem(setFeatureAccess);
  const remove = removeItem(setFeatureAccess);
  const addRow = () => setFeatureAccess(prev => [...prev, { id: uid("fa"), permission: "", collaborateur: "Non", manager: "Non", assistantRH: "Non", rh: "Non" }]);

  const extraRoles = roles.filter(r => !STANDARD_ROLES.includes(r.name) && r.name);
  const roleFieldMap = { collaborateur: "collaborateur", manager: "manager", assistantRH: "assistantRH", rh: "rh" };

  const columns = [
    { key: "permission", label: "Permission", minWidth: "300px", type: "text", inputClass: "font-medium", placeholder: "Nom de la permission" },
    ...["collaborateur", "manager", "assistantRH", "rh"].map(role => ({
      key: role, label: role === "assistantRH" ? "Assistant(e) RH" : role.charAt(0).toUpperCase() + role.slice(1),
      minWidth: "100px", center: true, type: "custom",
      render: (item) => <CheckToggle checked={item[role] === "Oui"} onChange={v => update(item.id, role, v ? "Oui" : "Non")} />,
    })),
    ...extraRoles.map(r => ({
      key: r.name, label: r.name, minWidth: "100px", center: true, type: "custom",
      render: (item) => <CheckToggle checked={item[r.name] === "Oui"} onChange={v => update(item.id, r.name, v ? "Oui" : "Non")} />,
    })),
  ];

  return (
    <div className="space-y-6">
      <SectionHeader title="2. Accès aux fonctionnalités" subtitle="Définissez les permissions de chaque rôle sur les fonctionnalités" />
      <DataTable columns={columns} data={featureAccess} onUpdate={update} onDelete={remove} onAdd={addRow} addLabel="Ajouter une permission" />
    </div>
  );
}
