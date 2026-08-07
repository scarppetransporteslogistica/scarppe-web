"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/content")
      .then((r) => r.json())
      .then((data) => {
        setContent(data);
        setLoading(false);
      });
  }, []);

  const save = useCallback(async (next) => {
    setSaving(true);
    setMessage("");
    const toSave = next || content;
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toSave),
      });
      if (res.ok) {
        setMessage("✓ Cambios guardados correctamente.");
        setTimeout(() => setMessage(""), 4000);
      } else {
        // Surface the real failure instead of a generic message, and keep
        // it on screen (no auto-hide) so a failed save is never mistaken
        // for a successful one.
        let detail = `(código ${res.status})`;
        try {
          const body = await res.json();
          if (body?.error) detail = body.error;
        } catch {}
        setMessage(`✗ No se pudo guardar ${detail}. Probá de nuevo — si persiste, esperá unos segundos (el servidor puede estar reactivándose) y volvé a intentar.`);
      }
    } catch (err) {
      // fetch() itself threw (network error, timeout, server cold-start on
      // Render's free tier, etc.) — this used to fail silently, leaving the
      // admin thinking the change was saved when it never reached the
      // server. Always show something concrete instead.
      setMessage("✗ No se pudo conectar con el servidor para guardar. Revisá tu conexión y probá de nuevo — si el sitio estuvo inactivo, puede tardar unos segundos en reactivarse.");
    } finally {
      setSaving(false);
    }
  }, [content]);

  return (
    <AdminContext.Provider value={{ content, setContent, save, saving, loading, message }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin debe usarse dentro de AdminProvider");
  return ctx;
}
