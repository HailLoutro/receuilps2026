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

  // ── Init ────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      // Listen for admin auth
      Auth.onAuthChange(async adminUser => {
        if (adminUser && adminUser.role === "admin") {
          setUser({ type: "admin", ...adminUser });
          let t = await DB.getTemplate();
          if (!t) { t = buildDefaultTemplate(); await DB.saveTemplate(t); }
          setTemplate(t);
          setClients(await DB.getClients());
          setBackups(await DB.getBackups());
        }
        setReady(true);
      });
    })();
  }, []);

  // ── Template save (debounced) ───────────────────────────────
  const _saveT = useCallback(async t => {
    setSaving(true);
    await DB.saveTemplate(t);
    setSaving(false);
  }, []);
  const dbSaveT = useDebounce(_saveT, 600);
  const sT = t => { setTemplate(t); dbSaveT(t); };

  // ── Client data save (debounced) ────────────────────────────
  const _saveCD = useCallback(async (slug, d) => {
    setSaving(true);
    await DB.saveClientData(slug, d);
    setSaving(false);
  }, []);
  const dbSaveCD = useDebounce((slug, d) => _saveCD(slug, d), 600);
  const sCD = (slug, d) => { setCData(d); dbSaveCD(slug, d); };

  // ── FIX #1: Client CRUD only touches clients[], not user ───
  const refreshClients = async () => { setClients(await DB.getClients()); };

  // ── Load client data ────────────────────────────────────────
  const lCD = async slug => {
    const d = await DB.getClientData(slug);
    setCData(d);
    return d;
  };

  // ── FIX #2: Client login via Firestore (not Firebase Auth) ──
  const loginClient = async (slug, username, password) => {
    const client = await Auth.loginClient(slug, username, password);
    if (!client) return false;
    setUser(client);
    let t = await DB.getTemplate();
    if (!t) { t = buildDefaultTemplate(); await DB.saveTemplate(t); }
    setTemplate(t);
    await lCD(client.slug);
    return true;
  };

  // ── FIX #5: Backup / Restore ────────────────────────────────
  const backupTpl = async label => {
    const b = {
      id: `bk_${Date.now()}`,
      label: label || `Backup ${new Date().toLocaleString("fr-FR")}`,
      template: JSON.parse(JSON.stringify(template)),
      createdAt: new Date().toISOString(),
    };
    const nb = [b, ...backups].slice(0, 20);
    setBackups(nb);
    await DB.saveBackups(nb);
  };
  const restoreTpl = async id => {
    const b = backups.find(x => x.id === id);
    if (!b) return;
    setTemplate(b.template);
    await DB.saveTemplate(b.template);
  };

  // ── Logout ──────────────────────────────────────────────────
  const logout = async () => {
    if (user?.type === "admin") await Auth.logoutUser();
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
