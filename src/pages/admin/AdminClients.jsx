// ━━━ ADMIN CLIENTS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FIX #1: sC/refreshClients ne touche PAS le user courant
// FIX #2: clients stockés dans Firestore (pas Firebase Auth)
import { useState } from "react";
import { Users, UserPlus, Plus, Trash2, Copy, Search, CheckCircle2 } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { createClient, deleteClient } from "../../services/database";
import { Btn, Inp, Card, Modal, Empty } from "../../components/ui";

export default function AdminClients() {
  const { clients, refreshClients } = useApp();
  const [show, setShow] = useState(false);
  const [nc, setNc] = useState({ name: "", slug: "", username: "", password: "" });
  const [q, setQ] = useState("");
  const [copied, setCopied] = useState(null);
  const [creating, setCreating] = useState(false);

  const create = async () => {
    if (!nc.name || !nc.slug || !nc.username || !nc.password) return;
    if (clients.find(c => c.slug === nc.slug)) { alert("Ce slug existe déjà"); return; }
    setCreating(true);
    try {
      await createClient(nc);
      await refreshClients();
      setNc({ name: "", slug: "", username: "", password: "" });
      setShow(false);
    } catch (err) {
      alert(`Erreur : ${err.message}`);
    }
    setCreating(false);
  };

  const del = async slug => {
    if (!confirm("Supprimer ce client et toutes ses données ?")) return;
    await deleteClient(slug);
    await refreshClients();
  };

  const copyCredentials = c => {
    navigator.clipboard.writeText(`URL: /client/${c.slug}\nLogin: ${c.username}\nMot de passe: ${c.password}`);
    setCopied(c.id); setTimeout(() => setCopied(null), 2000);
  };

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(q.toLowerCase()) || c.slug.includes(q.toLowerCase())
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
                  {copied === c.id
                    ? <><CheckCircle2 size={14} className="text-emerald-500" /> Copié</>
                    : <><Copy size={14} /> Identifiants</>}
                </Btn>
                <Btn v="ghost" s="sm" onClick={() => del(c.slug)} className="text-rose-500 hover:bg-rose-50">
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
            onChange={v => setNc({ ...nc, name: v, slug: v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") })}
            ph="Acme Corp" />
          <Inp label="Slug (identifiant URL)" value={nc.slug} onChange={v => setNc({ ...nc, slug: v })} ph="acme-corp" />
          <div className="grid grid-cols-2 gap-4">
            <Inp label="Login client" value={nc.username} onChange={v => setNc({ ...nc, username: v })} ph="acme-admin" />
            <Inp label="Mot de passe" value={nc.password} onChange={v => setNc({ ...nc, password: v })} ph="••••••" />
          </div>
          <Btn onClick={create} disabled={creating} className="w-full">{creating ? "Création..." : "Créer le client"}</Btn>
        </div>
      </Modal>
    </div>
  );
}
