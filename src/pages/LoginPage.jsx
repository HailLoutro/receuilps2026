// ━━━ LOGIN PAGE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Layers, AlertCircle } from "lucide-react";
import { useApp } from "../context/AppContext";
import { BRAND } from "../config/constants";
import { Btn, Inp, Card } from "../components/ui";
import { loginAdmin } from "../services/auth";

export default function LoginPage({ mode = "admin" }) {
  const { user, loginClient } = useApp();
  const navigate = useNavigate();
  const { slug: paramSlug } = useParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [slug, setSlug] = useState(paramSlug || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Naviguer quand user est set
  useEffect(() => {
    if (user?.type === "admin") navigate("/admin", { replace: true });
    if (user?.type === "client") navigate("/recueil", { replace: true });
  }, [user, navigate]);

  const go = async () => {
    setError("");
    setLoading(true);
    try {
      if (mode === "admin") {
        await loginAdmin(email, password);
        // → onAuthChange va setter user → useEffect navigue
      } else {
        if (!slug.trim()) {
          setError("Entrez le code client (slug)");
          setLoading(false);
          return;
        }
        const ok = await loginClient(slug.trim().toLowerCase(), email.trim(), password);
        if (!ok) {
          setError("Code client, identifiant ou mot de passe incorrect. Vérifiez les 3 champs.");
          setLoading(false);
          return;
        }
        // → loginClient a setté user → useEffect navigue
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Identifiants incorrects");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg,#0a0e3a 0%,#1a1f6c 40%,#2d3494 70%,#4e54c8 100%)", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      <link href={BRAND.font} rel="stylesheet" />
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl" />
      </div>
      <Card className="relative w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1a1f6c] to-[#4e54c8] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
            <Layers size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">{BRAND.name}</h1>
          <p className="text-sm text-slate-500 mt-1">
            {mode === "admin" ? "Administration" : "Espace client"}
          </p>
        </div>
        <div className="space-y-4">
          {mode === "client" && !paramSlug && (
            <Inp label="Code client" value={slug} onChange={setSlug}
              ph="Le code donné par votre consultant (ex: acme-corp)" />
          )}
          <Inp
            label={mode === "admin" ? "Email" : "Identifiant"}
            value={email} onChange={setEmail}
            ph={mode === "admin" ? "admin@entreprise.com" : "Votre identifiant"} />
          <Inp label="Mot de passe" value={password} onChange={setPassword}
            type="password" ph="••••••••"
            onKeyDown={e => e.key === "Enter" && go()} />
          {error && (
            <div className="flex items-start gap-2 text-sm text-rose-600 bg-rose-50 p-3 rounded-xl">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          <Btn onClick={go} disabled={loading} className="w-full" s="lg">
            {loading ? "Connexion..." : "Se connecter"}
          </Btn>
        </div>
        <div className="mt-6 text-center">
          <a href={mode === "admin" ? "/client" : "/admin/login"}
            className="text-xs text-blue-600 hover:underline">
            {mode === "admin" ? "Accès client →" : "← Accès admin"}
          </a>
        </div>
      </Card>
    </div>
  );
}
