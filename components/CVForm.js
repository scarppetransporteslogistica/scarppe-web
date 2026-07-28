"use client";
import { useState } from "react";

export default function CVForm() {
  const [status, setStatus] = useState("idle");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    const form = e.target;
    const formData = new FormData();
    formData.append("nombre", form.nombre.value);
    formData.append("email", form.email.value);
    formData.append("telefono", form.telefono.value);
    formData.append("mensaje", form.mensaje.value);
    if (form.cv.files[0]) formData.append("cv", form.cv.files[0]);

    try {
      const res = await fetch("/api/cv", { method: "POST", body: formData });
      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className="font-heading text-[11px] font-bold uppercase tracking-[0.2em] text-tertiary mb-1.5 block">Nombre y apellido *</label>
          <input name="nombre" required className="w-full border border-black/15 px-4 py-3 font-body text-primary focus:outline-none focus:border-accent" />
        </div>
        <div>
          <label className="font-heading text-[11px] font-bold uppercase tracking-[0.2em] text-tertiary mb-1.5 block">E-mail *</label>
          <input type="email" name="email" required className="w-full border border-black/15 px-4 py-3 font-body text-primary focus:outline-none focus:border-accent" />
        </div>
      </div>
      <div>
        <label className="font-heading text-[11px] font-bold uppercase tracking-[0.2em] text-tertiary mb-1.5 block">Teléfono</label>
        <input name="telefono" className="w-full border border-black/15 px-4 py-3 font-body text-primary focus:outline-none focus:border-accent" />
      </div>
      <div>
        <label className="font-heading text-[11px] font-bold uppercase tracking-[0.2em] text-tertiary mb-1.5 block">Mensaje</label>
        <textarea name="mensaje" rows={3} className="w-full border border-black/15 px-4 py-3 font-body text-primary focus:outline-none focus:border-accent" />
      </div>
      <div>
        <label className="font-heading text-[11px] font-bold uppercase tracking-[0.2em] text-tertiary mb-1.5 block">Currículum (PDF) *</label>
        <input type="file" name="cv" accept="application/pdf" required className="w-full font-body text-sm text-primary/70" />
      </div>
      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex items-center justify-center rounded-sm bg-secondary text-white font-heading text-xs font-bold uppercase tracking-[0.2em] px-8 py-4 hover:bg-tertiary transition-colors disabled:opacity-60"
      >
        {status === "sending" ? "Enviando..." : "Enviar Currículum"}
      </button>
      {status === "success" && (
        <p className="text-green-700 text-sm font-body">¡Gracias! Recibimos tu currículum.</p>
      )}
      {status === "error" && (
        <p className="text-red-600 text-sm font-body">Hubo un problema al enviar. Intentá nuevamente o escribinos directamente.</p>
      )}
    </form>
  );
}
