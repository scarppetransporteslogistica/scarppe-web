"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("Contraseña incorrecta");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary px-6">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-sm">
        <h1 className="font-heading text-2xl font-bold text-primary mb-1">Panel de Administración</h1>
        <p className="font-body text-sm text-primary/50 mb-6">Scarppe Transporte y Logística</p>
        <label className="font-body text-sm font-medium text-primary/80 mb-1.5 block">Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-black/10 px-4 py-3 font-body text-primary focus:outline-none focus:ring-2 focus:ring-tertiary/40 mb-4"
          autoFocus
        />
        {error && <p className="text-red-600 text-sm font-body mb-4">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center rounded-full bg-secondary text-white font-semibold px-7 py-3 hover:bg-tertiary transition-colors disabled:opacity-60"
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
