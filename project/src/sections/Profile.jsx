import { useApp } from "../../context/AppContext";
import { SectionHeader, InfoBox, Select, InlineInput, CheckToggle, EyeToggle, PermissionSelect, AddRowButton, DeleteButton } from "../ui";
import { FIELD_TYPES, SENSITIVITY_OPTIONS, PERMISSION_OPTIONS, CATEGORIES } from "../../config/options";
import { uid } from "../../config/defaults";

export default function Profile() {
  const { profileFields, setProfileFields, roleNames, updateItem, removeItem } = useApp();

  const update = updateItem(setProfileFields);
  const remove = removeItem(setProfileFields);
  const updatePerm = (id, role, val) => setProfileFields(prev => prev.map(f => f.id === id ? { ...f, permissions: { ...f.permissions, [role]: val } } : f));
  const addField = () => setProfileFields(prev => [...prev, {
    id: uid("f"), category: "", field: "", subfield: "", type: "", optionList: "Non",
    domain: "Domaine Global Utilisateur", sensitivity: "Non sensibles", present: "Oui", public: "Non",
    inCreation: "Non", prefilled: "Non", prefilledValue: "", required: "Non",
    permissions: Object.fromEntries(["Soi-même", ...roleNames].map(r => [r, "Masquer"])),
  }]);

  const permRoles = ["Soi-même", ...roleNames.filter(n => n !== "Salarié")];

  // Group by category
  const grouped = profileFields.reduce((acc, f) => {
    const cat = f.category || "Autre";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(f);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <SectionHeader title="3a. Profil de l'utilisateur" subtitle="Configurez les champs du profil collaborateur et les permissions par rôle" />
      <InfoBox>
        <strong>Conseil :</strong> Très peu de données doivent être publiques. Nous conseillons uniquement : Prénom, Nom, e-mail pro, téléphone pro, site.
        Par défaut, ne donnez pas accès à la modification des champs nécessitant un workflow de validation directement sur le profil.
      </InfoBox>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="sticky top-0 z-10">
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left p-2 font-semibold text-slate-600 min-w-[110px]">Catégorie</th>
                <th className="text-left p-2 font-semibold text-slate-600 min-w-[150px]">Champ</th>
                <th className="text-left p-2 font-semibold text-slate-600 min-w-[110px]">Sous-champ</th>
                <th className="text-left p-2 font-semibold text-slate-600 min-w-[120px]">Type</th>
                <th className="text-center p-2 font-semibold text-slate-600 min-w-[55px]">Présent</th>
                <th className="text-center p-2 font-semibold text-slate-600 min-w-[55px]">Public</th>
                <th className="text-left p-2 font-semibold text-slate-600 min-w-[100px]">Sensibilité</th>
                {permRoles.map(r => <th key={r} className="text-center p-2 font-semibold text-slate-600 min-w-[85px]">{r}</th>)}
                <th className="w-8 p-2" />
              </tr>
            </thead>
            <tbody>
              {Object.entries(grouped).map(([cat, fields]) =>
                fields.map((f, fi) => (
                  <tr key={f.id} className="border-b border-slate-100 hover:bg-blue-50/30 transition-colors">
                    {fi === 0 && (
                      <td className="p-2 font-semibold text-slate-700 bg-slate-50/80 align-top text-xs" rowSpan={fields.length}>
                        {cat}
                      </td>
                    )}
                    <td className="p-2"><InlineInput value={f.field} onChange={v => update(f.id, "field", v)} className="text-xs font-medium" /></td>
                    <td className="p-2"><InlineInput value={f.subfield} onChange={v => update(f.id, "subfield", v)} className="text-xs" /></td>
                    <td className="p-2"><Select value={f.type} onChange={v => update(f.id, "type", v)} options={FIELD_TYPES} className="text-xs !px-1 !py-1" /></td>
                    <td className="p-2 text-center"><CheckToggle checked={f.present === "Oui"} onChange={v => update(f.id, "present", v ? "Oui" : "Non")} size="sm" color="green" /></td>
                    <td className="p-2 text-center"><EyeToggle checked={f.public === "Oui"} onChange={v => update(f.id, "public", v ? "Oui" : "Non")} /></td>
                    <td className="p-2"><Select value={f.sensitivity} onChange={v => update(f.id, "sensitivity", v)} options={SENSITIVITY_OPTIONS} className="text-xs !px-1 !py-1" /></td>
                    {permRoles.map(r => (
                      <td key={r} className="p-2 text-center">
                        <PermissionSelect value={f.permissions?.[r]} onChange={v => updatePerm(f.id, r, v)} options={PERMISSION_OPTIONS} />
                      </td>
                    ))}
                    <td className="p-2"><DeleteButton onClick={() => remove(f.id)} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-100">
          <AddRowButton onClick={addField} label="Ajouter un champ" />
        </div>
      </div>
    </div>
  );
}
