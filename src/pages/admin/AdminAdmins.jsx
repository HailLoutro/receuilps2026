// ━━━ ADMIN ADMINS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
import { useState, useEffect } from "react";
import { Lock, UserPlus, Trash2 } from "lucide-react";
import { getAdmins } from "../../services/database";
import { createAdminAccount } from "../../services/auth";
import { Btn, Inp, Card, Modal } from "../../components/ui";

export default function AdminAdmins() {
  const [admins, setAdmins] = useState([]);
  const [show, setShow] = useState(false);
  const [na, setNa] = useState({ email: "", password: "", name: "" });
  const [busy, setBusy] = useState(false);

  useEffect(() => { load(); }, []);
  const load = async () => setAdmins(await getAdmins());

  const add = async () => {
    if (!na.email || !na.password || !na.name) return;
    if (na.password.length < 6) { alert("Min. 6 caractères"); return; }
    setBusy(true);
    try {
      await createAdminAccount(na.email, na.password, na.name);
      await load();
      setNa({ email: "", password: "", name: "" });
      setShow(false);
    } catch (err) {
      alert(`Erreur : ${err.message}`);
    }
    setBusy(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold text-slate-900">Administrateurs</h2>
        <Btn onClick={() => setShow(true)}><UserPlus size={16} /> Nouvel admin</Btn>
      </div>
      <div className="grid gap-3">
        {admins.map(a => (
          <Card key={a.uid} className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center"><Lock size={16} className="text-slate-500" /></div>
              <div>
                <span className="font-semibold text-slate-900">{a.name || "Admin"}</span>
                {a.email && <p className="text-xs text-slate-500">{a.email}</p>}
              </div>
            </div>
          </Card>
        ))}
      </div>
      <Modal open={show} onClose={() => setShow(false)} title="Nouvel administrateur">
        <div className="space-y-4">
          <Inp label="Nom" value={na.name} onChange={v => setNa({ ...na, name: v })} ph="Jean Dupont" />
          <Inp label="Email" value={na.email} onChange={v => setNa({ ...na, email: v })} type="email" ph="admin@entreprise.com" />
          <Inp label="Mot de passe (min. 6 car.)" value={na.password} onChange={v => setNa({ ...na, password: v })} type="password" />
          <Btn onClick={add} disabled={busy} className="w-full">{busy ? "Création..." : "Créer"}</Btn>
        </div>
      </Modal>
    </div>
  );
}
