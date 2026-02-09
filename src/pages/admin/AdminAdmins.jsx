// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ADMIN ADMINS — Gestion des comptes administrateurs
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { useState, useEffect } from "react";
import { Lock, UserPlus, Trash2 } from "lucide-react";
import { getAdmins } from "../../services/database";
import { createUser } from "../../services/auth";
import { Btn, Inp, Card, Modal } from "../../components/ui";

export default function AdminAdmins() {
  const [admins, setAdmins] = useState([]);
  const [showNew, setShowNew] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ email: "", password: "", name: "" });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    setAdmins(await getAdmins());
  };

  const handleCreate = async () => {
    if (!newAdmin.email || !newAdmin.password || !newAdmin.name) return;
    setCreating(true);
    try {
      await createUser({
        email: newAdmin.email,
        password: newAdmin.password,
        role: "admin",
        name: newAdmin.name,
        slug: null,
      });
      await loadAdmins();
      setNewAdmin({ email: "", password: "", name: "" });
      setShowNew(false);
    } catch (err) {
      alert(`Erreur : ${err.message}`);
    }
    setCreating(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold text-slate-900">Administrateurs</h2>
        <Btn onClick={() => setShowNew(true)}>
          <UserPlus size={16} /> Nouvel admin
        </Btn>
      </div>

      <div className="grid gap-3">
        {admins.map((a) => (
          <Card key={a.uid} className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                <Lock size={16} className="text-slate-500" />
              </div>
              <div>
                <span className="font-semibold text-slate-900">{a.name || a.email}</span>
                <p className="text-xs text-slate-500">{a.email}</p>
                {a.createdAt && (
                  <p className="text-xs text-slate-400">
                    Créé le {new Date(a.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={showNew} onClose={() => setShowNew(false)} title="Nouvel administrateur">
        <div className="space-y-4">
          <Inp label="Nom" value={newAdmin.name} onChange={(v) => setNewAdmin({ ...newAdmin, name: v })} placeholder="Jean Dupont" />
          <Inp label="Email" value={newAdmin.email} onChange={(v) => setNewAdmin({ ...newAdmin, email: v })} type="email" placeholder="admin@peoplespheres.com" />
          <Inp label="Mot de passe" value={newAdmin.password} onChange={(v) => setNewAdmin({ ...newAdmin, password: v })} type="password" placeholder="••••••••" />
          <Btn onClick={handleCreate} disabled={creating} className="w-full">
            {creating ? "Création..." : "Créer"}
          </Btn>
        </div>
      </Modal>
    </div>
  );
}
