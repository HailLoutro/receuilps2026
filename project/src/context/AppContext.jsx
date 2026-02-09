// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AppContext.jsx — State centralisé + auto-save
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import {
  DEFAULT_ROLES, DEFAULT_PROFILE_FIELDS, DEFAULT_PROCESSES,
  DEFAULT_AUTOMATIONS, DEFAULT_FEATURE_ACCESS, DEFAULT_GROUPS,
  DEFAULT_TEMPLATE_DATA, DEFAULT_DOC_MODELS, DEFAULT_DOC_BASE,
  DEFAULT_PSO, uid,
} from "../config/defaults";

const AppContext = createContext(null);

const STORAGE_KEY = "ps-recueil-data-v2";

export function AppProvider({ children }) {
  // ── Navigation ──────────────────────────────────────────────────
  const [section, setSection] = useState("accueil");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ── Save status ─────────────────────────────────────────────────
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  // ── Data stores ─────────────────────────────────────────────────
  const [roles, setRoles] = useState(DEFAULT_ROLES);
  const [customRoleCols, setCustomRoleCols] = useState([]);
  const [profileFields, setProfileFields] = useState(DEFAULT_PROFILE_FIELDS);
  const [processes, setProcesses] = useState(DEFAULT_PROCESSES);
  const [customProcesses, setCustomProcesses] = useState([]);
  const [automations, setAutomations] = useState(DEFAULT_AUTOMATIONS);
  const [customAutomations, setCustomAutomations] = useState([]);
  const [featureAccess, setFeatureAccess] = useState(DEFAULT_FEATURE_ACCESS);
  const [groups, setGroups] = useState(DEFAULT_GROUPS);
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [templateData, setTemplateData] = useState(DEFAULT_TEMPLATE_DATA);
  const [docModels, setDocModels] = useState(DEFAULT_DOC_MODELS);
  const [docBase, setDocBase] = useState(DEFAULT_DOC_BASE);
  const [pso, setPso] = useState(DEFAULT_PSO);

  // ── Derived values ──────────────────────────────────────────────
  const roleNames = roles.map(r => r.name).filter(Boolean);

  // ── Load from storage ───────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get(STORAGE_KEY);
        if (r?.value) {
          const d = JSON.parse(r.value);
          if (d.roles) setRoles(d.roles);
          if (d.customRoleCols) setCustomRoleCols(d.customRoleCols);
          if (d.profileFields) setProfileFields(d.profileFields);
          if (d.processes) setProcesses(d.processes);
          if (d.customProcesses) setCustomProcesses(d.customProcesses);
          if (d.automations) setAutomations(d.automations);
          if (d.customAutomations) setCustomAutomations(d.customAutomations);
          if (d.featureAccess) setFeatureAccess(d.featureAccess);
          if (d.groups) setGroups(d.groups);
          if (d.selectedTemplate !== undefined) setSelectedTemplate(d.selectedTemplate);
          if (d.templateData) setTemplateData(d.templateData);
          if (d.docModels) setDocModels(d.docModels);
          if (d.docBase) setDocBase(d.docBase);
          if (d.pso) setPso(d.pso);
          if (d.section) setSection(d.section);
        }
      } catch { /* first load */ }
    })();
  }, []);

  // ── Auto-save (debounced) ───────────────────────────────────────
  const saveTimer = useRef(null);
  const allData = { roles, customRoleCols, profileFields, processes, customProcesses, automations, customAutomations, featureAccess, groups, selectedTemplate, templateData, docModels, docBase, pso, section };

  const doSave = useCallback(async () => {
    setSaving(true);
    try {
      await window.storage.set(STORAGE_KEY, JSON.stringify(allData));
      setLastSaved(new Date());
    } catch { /* */ }
    setSaving(false);
  }, [JSON.stringify(allData)]);

  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(doSave, 1200);
    return () => clearTimeout(saveTimer.current);
  }, [doSave]);

  // ── Generic helpers ─────────────────────────────────────────────
  const updateItem = (setter) => (id, field, value) =>
    setter(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));

  const removeItem = (setter) => (id) =>
    setter(prev => prev.filter(item => item.id !== id));

  const addItem = (setter) => (newItem) =>
    setter(prev => [...prev, { ...newItem, id: uid(newItem.id || "item") }]);

  // ── Progress calculation ────────────────────────────────────────
  const calcProgress = useCallback(() => {
    const filled = (arr, fields) => {
      if (!arr.length) return 0;
      const total = arr.length * fields.length;
      const count = arr.reduce((acc, item) => acc + fields.filter(f => item[f] && item[f] !== "").length, 0);
      return Math.min(100, Math.round((count / total) * 100));
    };
    return {
      roles: filled(roles, ["name", "assignment", "sensitivity"]),
      featureAccess: featureAccess.length > 10 ? 70 : featureAccess.length > 0 ? 40 : 0,
      profileFields: filled(profileFields.slice(0, 10), ["field", "type", "present"]),
      processes: filled(processes.slice(0, 8), ["name", "initiator", "keep"]),
      automations: automations.filter(a => a.keep === "Oui").length > 0 ? 80 : automations.length > 0 ? 30 : 0,
      groups: filled(groups, ["name", "constitution"]),
      widgets: selectedTemplate ? 60 : 0,
      docModels: filled(docModels, ["name", "target"]),
      docBase: docBase.store === "Oui" ? 60 : 30,
      pso: filled(pso, ["name", "objective"]),
    };
  }, [roles, featureAccess, profileFields, processes, automations, groups, selectedTemplate, docModels, docBase, pso]);

  const progress = calcProgress();
  const totalProgress = Math.round(Object.values(progress).reduce((a, b) => a + b, 0) / Object.keys(progress).length);

  // ── Context value ───────────────────────────────────────────────
  const value = {
    // Nav
    section, setSection, sidebarOpen, setSidebarOpen,
    // Status
    saving, lastSaved,
    // Data
    roles, setRoles,
    customRoleCols, setCustomRoleCols,
    profileFields, setProfileFields,
    processes, setProcesses,
    customProcesses, setCustomProcesses,
    automations, setAutomations,
    customAutomations, setCustomAutomations,
    featureAccess, setFeatureAccess,
    groups, setGroups,
    selectedTemplate, setSelectedTemplate,
    templateData, setTemplateData,
    docModels, setDocModels,
    docBase, setDocBase,
    pso, setPso,
    // Derived
    roleNames,
    // Progress
    progress, totalProgress,
    // Helpers
    updateItem, removeItem, addItem,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};
