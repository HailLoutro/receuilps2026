// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// APP CONTEXT — State centralisé + Firebase
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import * as Auth from "../services/auth";
import * as DB from "../services/database";
import buildDefaultTemplate from "../config/defaultTemplate";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState(null);      // { uid, email, role, name, slug }
  const [clients, setClients] = useState([]);
  const [template, setTemplate] = useState({ pages: [] });
  const [clientData, setClientData] = useState({});
  const [saving, setSaving] = useState(false);

  // ── Auth listener ───────────────────────────────────────────
  useEffect(() => {
    const unsub = Auth.onAuthChange(async (u) => {
      setUser(u);
      if (u) {
        // Charger le template
        let t = await DB.getTemplate();
        if (!t) {
          t = buildDefaultTemplate();
          await DB.saveTemplate(t);
        }
        setTemplate(t);

        // Si admin, charger la liste des clients
        if (u.role === "admin") {
          setClients(await DB.getClients());
        }

        // Si client, charger ses données
        if (u.role === "client" && u.slug) {
          setClientData(await DB.getClientData(u.slug));
        }
      }
      setReady(true);
    });
    return unsub;
  }, []);

  // ── Actions ─────────────────────────────────────────────────

  const login = async (email, password) => {
    return Auth.login(email, password);
  };

  const logout = async () => {
    await Auth.logoutUser();
    setUser(null);
    setClientData({});
    setClients([]);
  };

  const saveTemplateToDB = useCallback(async (t) => {
    setTemplate(t);
    setSaving(true);
    await DB.saveTemplate(t);
    setSaving(false);
  }, []);

  const saveClientDataToDB = useCallback(async (slug, data) => {
    setClientData(data);
    setSaving(true);
    await DB.saveClientData(slug, data);
    setSaving(false);
  }, []);

  const refreshClients = async () => {
    setClients(await DB.getClients());
  };

  const loadClientData = async (slug) => {
    const d = await DB.getClientData(slug);
    setClientData(d);
    return d;
  };

  // ── Value ───────────────────────────────────────────────────

  return (
    <AppContext.Provider value={{
      ready, user, clients, template, clientData, saving,
      login, logout,
      saveTemplate: saveTemplateToDB,
      saveClientData: saveClientDataToDB,
      refreshClients, loadClientData,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};
