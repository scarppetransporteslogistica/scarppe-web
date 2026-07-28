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
    const res = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toSave),
    });
    setSaving(false);
    if (res.ok) {
      setMessage("Cambios guardados correctamente.");
      setTimeout(() => setMessage(""), 3000);
    } else {
      setMessage("Error al guardar los cambios.");
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
