// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LOGIN PAGE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Layers, AlertCircle } from "lucide-react";
import { useApp } from "../context/AppContext";
import { BRAND } from "../config/constants";

export default function LoginPage({ mode = "admin" }) {
  const { login } = useApp();
  const navigate = useNavigate();
  const { slug: paramSlug } = useParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === "admin") navigate("/admin");
      else navigate("/client");
    } catch (err) {
      setError("Identifiants incorrects");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-brand-900 via-brand-700 to-brand-500">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-700 to-brand-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
            <Layers size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">{BRAND.name}</h1>
          <p className="text-sm text-slate-500 mt-1">
            {mode === "admin" ? "Administration" : "Espace client"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@entreprise.com"
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-rose-600 bg-rose-50 p-3 rounded-xl">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-700 text-white font-semibold py-3 rounded-xl hover:bg-brand-600 transition-colors disabled:opacity-50"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        {/* Switch mode */}
        <div className="mt-6 text-center">
          <a
            href={mode === "admin" ? "/client" : "/admin"}
            className="text-xs text-blue-600 hover:underline"
          >
            {mode === "admin" ? "Accès client →" : "← Accès admin"}
          </a>
        </div>
      </div>
    </div>
  );
}
