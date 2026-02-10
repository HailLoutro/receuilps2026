// ━━━ APP CONTEXT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import * as Auth from "../services/auth";
import * as DB from "../services/database";
import buildDefaultTemplate from "../config/defaultTemplate";

const AppContext = createContext(null);

function useDebounce(fn, ms = 700) {
  const t = useRef(null);
  return useCallback((...a) => {
    clearTimeout(t.current);
    t.current = setTimeout(() => fn(...a), ms);
  }, [fn, ms]);
}

export function AppProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState(null);
  const [clients, setClients] = useState([]);
  const [template, setTemplate] = useState({ pages: [] });
  const [cData, setCData] = useState({});
  const [saving, setSaving] = useState(false);
  const [backups, setBackups] = useState([]);

  // ── Init : onAuthChange gère le restore de session ─────────
  // loginClient gère son propre flow SANS dépendre de onAuthChange
  useEffect(() => {
    Auth.onAuthChange(async (authUser) => {
      // Charger template quoi qu'il arrive
      let t = await DB.getTemplate();
      if (!t) { t = buildDefaultTemplate(); await DB.saveTemplate(t); }
      setTemplate(t);

      if (authUser && authUser.role === "admin") {
        setUser(prev => {
          // Ne pas écraser si déjà connecté en admin
          if (prev?.type === "admin") return prev;
          return { type: "admin", ...authUser };
        });
        setClients(await DB.getClients());
        setBackups(await DB.getBackups());
      } else if (authUser && authUser.role === "client") {
        setUser(prev => {
          // Ne pas écraser si déjà connecté en client (loginClient l'a déjà fait)
          if (prev?.type === "client") return prev;
          return { type: "client", ...authUser };
        });
        const d = await DB.getClientData(authUser.slug);
        setCData(d);
      }
      // Pas de else { setUser(null) } — on laisse loginClient gérer

      setReady(true);
    });
  }, []);

  // ── Template save ──────────────────────────────────────────
  const _sT = useCallback(async t => { setSaving(true); await DB.saveTemplate(t); setSaving(false); }, []);
  const dbST = useDebounce(_sT, 600);
  const sT = t => { setTemplate(t); dbST(t); };

  // ── Client data save ──────────────────────────────────────
  const _sCD = useCallback(async (slug, d) => { setSaving(true); await DB.saveClientData(slug, d); setSaving(false); }, []);
  const dbSCD = useDebounce((s, d) => _sCD(s, d), 600);
  const sCD = (slug, d) => { setCData(d); dbSCD(slug, d); };

  const refreshClients = async () => setClients(await DB.getClients());
  const lCD = async slug => { const d = await DB.getClientData(slug); setCData(d); return d; };

  // ── Client login (self-contained, ne dépend pas de onAuthChange) ──
  const loginClient = async (slug, username, password) => {
    try {
      const client = await Auth.loginClient(slug, username, password);
      if (!client) return false;

      let t = await DB.getTemplate();
      if (!t) { t = buildDefaultTemplate(); await DB.saveTemplate(t); }
      setTemplate(t);

      const d = await DB.getClientData(client.slug);
      setCData(d);
      setUser(client);
      setReady(true); // ← CRITIQUE : garantit que ready=true après login
      return true;
    } catch (err) {
      console.error("loginClient error:", err);
      return false;
    }
  };

  // ── Backup / Restore ──────────────────────────────────────
  const backupTpl = async label => {
    const b = { id: `bk_${Date.now()}`, label: label || `Backup ${new Date().toLocaleString("fr-FR")}`, template: JSON.parse(JSON.stringify(template)), createdAt: new Date().toISOString() };
    const nb = [b, ...backups].slice(0, 20);
    setBackups(nb); await DB.saveBackups(nb);
  };
  const restoreTpl = async id => {
    const b = backups.find(x => x.id === id);
    if (!b) return;
    setTemplate(b.template); await DB.saveTemplate(b.template);
  };

  // ── Logout ────────────────────────────────────────────────
  const logout = async () => {
    await Auth.logoutUser();
    setUser(null);
    setCData({});
  };

  return (
    <AppContext.Provider value={{
      ready, user, clients, template, cData, saving, backups,
      sT, sCD, lCD, loginClient, refreshClients, logout,
      backupTpl, restoreTpl,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
};
