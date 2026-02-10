// ━━━ ADMIN CLIENTS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// L'admin crée un client = simple écriture Firestore.
// Le compte Firebase Auth sera créé automatiquement au premier login client.
import { useState } from "react";
import { Users, UserPlus, Plus, Trash2, Copy, Search, CheckCircle2, Info } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { createClient, deleteClient } from "../../services/database";
import { Btn, Inp, Card, Modal, Empty } from "../../components/ui";

export default function AdminClients() {
  const { clients, refreshClients } = useApp();
  const [show, setShow] = useState(false);
  const [nc, setNc] = useState({ name: "", slug: "", username: "", password: "" });
  const [q, setQ] = useState("");
  const [copied, setCopied] = useState(null);
  const [busy, setBusy] = useState(false);

  const create = async () => {
    if (!nc.name || !nc.slug || !nc.username || !nc.password) return;
    if (clients.find(c => c.slug === nc.slug)) { alert("Ce slug existe déjà"); return; }
    if (nc.password.length < 6) { alert("Le mot de passe doit faire au moins 6 caractères (requis par Firebase)"); return; }
    setBusy(true);
    try {
      await createClient(nc);
      await refreshClients();
      setNc({ name: "", slug: "", username: "", password: "" });
      setShow(false);
    } catch (err) {
      alert(`Erreur : ${err.message}`);
    }
    setBusy(false);
  };

  const del = async slug => {
    if (!confirm(`Supprimer le client "${slug}" et toutes ses données ?`)) return;
    setBusy(true);
    try {
      await deleteClient(slug);
      await refreshClients();
    } catch (err) {
      alert(`Erreur suppression : ${err.message}`);
    }
    setBusy(false);
  };

  const copyCredentials = c => {
    const text = [
      `═══ Identifiants ${c.name} ═══`,
      `URL de connexion : ${window.location.origin}/client/${c.slug}`,
      `Code client : ${c.slug}`,
      `Identifiant : ${c.username}`,
      `Mot de passe : ${c.password}`,
    ].join("\n");
    navigator.clipboard.writeText(text);
    setCopied(c.slug);
    setTimeout(() => setCopied(null), 2000);
  };

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(q.toLowerCase()) ||
    c.slug.includes(q.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">Clients</h2>
          <p className="text-slate-500 text-sm mt-1">{clients.length} client{clients.length > 1 ? "s" : ""}</p>
        </div>
        <Btn onClick={() => setShow(true)}><UserPlus size={16} /> Nouveau client</Btn>
      </div>

      {clients.length > 3 && (
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Rechercher..."
            className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1f6c]/20" />
        </div>
      )}

      {!filtered.length ? (
        <Empty icon={Users} title="Aucun client" desc="Créez votre premier client pour commencer"
          action={<Btn onClick={() => setShow(true)} s="sm"><Plus size={14} /> Créer</Btn>} />
      ) : (
        <div className="grid gap-3">
          {filtered.map(c => (
            <Card key={c.slug} className="p-5 flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#1a1f6c] to-[#4e54c8] flex items-center justify-center text-white font-bold text-lg shadow-sm">
                  {c.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{c.name}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                    <span className="font-mono bg-slate-100 px-2 py-0.5 rounded">{c.slug}</span>
                    <span>👤 {c.username}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Btn v="ghost" s="sm" onClick={() => copyCredentials(c)}>
                  {copied === c.slug
                    ? <><CheckCircle2 size={14} className="text-emerald-500" /> Copié</>
                    : <><Copy size={14} /> Identifiants</>}
                </Btn>
                <Btn v="danger" s="sm" onClick={() => del(c.slug)} disabled={busy}>
                  <Trash2 size={14} />
                </Btn>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={show} onClose={() => setShow(false)} title="Nouveau client">
        <div className="space-y-4">
          <Inp label="Nom de l'entreprise" value={nc.name}
            onChange={v => setNc({
              ...nc, name: v,
              slug: v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
            })}
            ph="Acme Corp" />
          <Inp label="Slug (code client pour la connexion)" value={nc.slug}
            onChange={v => setNc({ ...nc, slug: v })} ph="acme-corp" />
          <div className="grid grid-cols-2 gap-4">
            <Inp label="Login client" value={nc.username}
              onChange={v => setNc({ ...nc, username: v })} ph="jean.dupont" />
            <Inp label="Mot de passe (min. 6 car.)" value={nc.password}
              onChange={v => setNc({ ...nc, password: v })} ph="motdepasse" />
          </div>

          <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-800 space-y-1">
            <div className="flex items-center gap-2 font-semibold"><Info size={14} /> Le client se connectera avec :</div>
            <div className="ml-5 font-mono text-xs space-y-0.5">
              <div>Code client : <strong>{nc.slug || "..."}</strong></div>
              <div>Identifiant : <strong>{nc.username || "..."}</strong></div>
              <div>Mot de passe : <strong>{nc.password || "..."}</strong></div>
            </div>
            <div className="ml-5 mt-2 text-xs text-blue-600">
              URL directe : {window.location.origin}/client/{nc.slug || "..."}
            </div>
          </div>

          <Btn onClick={create} disabled={busy || nc.password.length < 6} className="w-full">
            {busy ? "Création..." : "Créer le client"}
          </Btn>
        </div>
      </Modal>
    </div>
  );
}
