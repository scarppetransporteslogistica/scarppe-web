"use client";
import { useState } from "react";

export default function CVForm({ accessKey }) {
  const [status, setStatus] = useState("idle");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    const form = e.target;
    try {
      // Step 1: upload the PDF to our own server, which stores it and gives
      // back a public link (Web3Forms' free plan can't carry attachments).
      let cvUrl = "";
      if (form.cv.files[0]) {
        const fd = new FormData();
        fd.append("cv", form.cv.files[0]);
        const up = await fetch("/api/cv", { method: "POST", body: fd });
        const upJson = await up.json().catch(() => ({}));
        if (!up.ok || !upJson.ok) throw new Error("upload failed");
        cvUrl = upJson.cvUrl || "";
      }
      // Step 2: send the e-mail straight from the browser to Web3Forms
      // (server-to-server sending is blocked on their free plan — that's
      // why the form had stopped working).
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: accessKey,
          subject: `Nuevo currículum — ${form.nombre.value}`,
          from_name: "Sitio web Scarppe",
          replyto: form.email.value,
          Nombre: form.nombre.value,
          Email: form.email.value,
          Telefono: form.telefono.value,
          Mensaje: form.mensaje.value,
          "Archivo CV (hacé clic para abrir/descargar)": cvUrl || "No adjuntado",
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success) {
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
        className="btn-cta w-full sm:w-auto inline-flex items-center justify-center rounded-sm bg-secondary text-white font-heading font-bold uppercase tracking-[0.2em] px-8 py-4 hover:bg-tertiary transition-colors disabled:opacity-60"
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
