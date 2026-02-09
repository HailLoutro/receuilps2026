// ━━━ ADMIN ADMINS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
import { useState, useEffect } from "react";
import { Lock, UserPlus, Trash2 } from "lucide-react";
import { getAdmins } from "../../services/database";
import { createAdmin } from "../../services/auth";
import { Btn, Inp, Card, Modal } from "../../components/ui";

export default function AdminAdmins() {
  const [admins, setAdmins] = useState([]);
  const [show, setShow] = useState(false);
  const [na, setNa] = useState({ email: "", password: "", name: "" });
  const [creating, setCreating] = useState(false);

  useEffect(() => { loadAdmins(); }, []);

  const loadAdmins = async () => { setAdmins(await getAdmins()); };

  const add = async () => {
    if (!na.email || !na.password || !na.name) return;
    setCreating(true);
    try {
      await createAdmin(na);
      await loadAdmins();
      setNa({ email: "", password: "", name: "" });
      setShow(false);
    } catch (err) {
      alert(`Erreur : ${err.message}`);
    }
    setCreating(false);
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
                <span className="font-semibold text-slate-900">{a.name || a.email}</span>
                {a.email && <p className="text-xs text-slate-500">{a.email}</p>}
                {a.createdAt && <p className="text-xs text-slate-400">Créé le {new Date(a.createdAt).toLocaleDateString("fr-FR")}</p>}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={show} onClose={() => setShow(false)} title="Nouvel administrateur">
        <div className="space-y-4">
          <Inp label="Nom" value={na.name} onChange={v => setNa({ ...na, name: v })} ph="Jean Dupont" />
          <Inp label="Email" value={na.email} onChange={v => setNa({ ...na, email: v })} type="email" ph="admin@peoplespheres.com" />
          <Inp label="Mot de passe" value={na.password} onChange={v => setNa({ ...na, password: v })} type="password" ph="••••••••" />
          <Btn onClick={add} disabled={creating} className="w-full">{creating ? "Création..." : "Créer"}</Btn>
        </div>
      </Modal>
    </div>
  );
}
