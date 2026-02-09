// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ADMIN CLIENTS — CRUD clients avec Firebase Auth + Firestore
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { useState } from "react";
import { Users, UserPlus, Plus, Search, Copy, Trash2 } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { createUser } from "../../services/auth";
import { createClient, deleteClient } from "../../services/database";
import { uid } from "../../config/constants";

export default function AdminClients() {
  const { clients, refreshClients } = useApp();
  const [showNew, setShowNew] = useState(false);
  const [search, setSearch] = useState("");
  const [newClient, setNewClient] = useState({
    name: "", slug: "", email: "", password: "",
  });
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!newClient.name || !newClient.slug || !newClient.email || !newClient.password) return;
    setCreating(true);
    try {
      // 1. Créer le compte Firebase Auth
      await createUser({
        email: newClient.email,
        password: newClient.password,
        role: "client",
        name: newClient.name,
        slug: newClient.slug,
      });
      // 2. Créer le doc client dans Firestore
      await createClient({
        slug: newClient.slug,
        name: newClient.name,
        createdAt: new Date().toISOString(),
      });
      await refreshClients();
      setNewClient({ name: "", slug: "", email: "", password: "" });
      setShowNew(false);
    } catch (err) {
      alert(`Erreur : ${err.message}`);
    }
    setCreating(false);
  };

  const handleDelete = async (client) => {
    if (!confirm(`Supprimer ${client.name} et ses données ?`)) return;
    await deleteClient(client.slug);
    await refreshClients();
  };

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">Clients</h2>
          <p className="text-slate-500 text-sm mt-1">
            {clients.length} client{clients.length > 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="inline-flex items-center gap-2 bg-brand-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-brand-600"
        >
          <UserPlus size={16} /> Nouveau client
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un client..."
          className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        />
      </div>

      {/* Client list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Users size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="font-bold text-slate-800">Aucun client</h3>
          <p className="text-sm text-slate-500 mt-1">Créez votre premier client</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((c) => (
            <div
              key={c.id || c.slug}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-700 to-brand-500 flex items-center justify-center text-white font-bold text-lg">
                  {c.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{c.name}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                    <span className="font-mono bg-slate-100 px-2 py-0.5 rounded">{c.slug}</span>
                    {c.createdAt && (
                      <span>📅 {new Date(c.createdAt).toLocaleDateString("fr-FR")}</span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleDelete(c)}
                className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-lg"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Create modal */}
      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowNew(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Nouveau client</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nom de l'entreprise</label>
                <input
                  value={newClient.name}
                  onChange={(e) =>
                    setNewClient({
                      ...newClient,
                      name: e.target.value,
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
                    })
                  }
                  placeholder="Acme Corporation"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Slug (URL)</label>
                <input
                  value={newClient.slug}
                  onChange={(e) => setNewClient({ ...newClient, slug: e.target.value })}
                  placeholder="acme-corp"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email client</label>
                  <input
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    placeholder="contact@acme.com"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mot de passe</label>
                  <input
                    type="password"
                    value={newClient.password}
                    onChange={(e) => setNewClient({ ...newClient, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                  />
                </div>
              </div>
              <button
                onClick={handleCreate}
                disabled={creating}
                className="w-full bg-brand-700 text-white font-semibold py-2.5 rounded-xl hover:bg-brand-600 disabled:opacity-50"
              >
                {creating ? "Création..." : "Créer le client"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
