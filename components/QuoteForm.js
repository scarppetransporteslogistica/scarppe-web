"use client";
import { useState } from "react";

const SERVICIOS_OPCIONES = [
  "Transporte Nacional",
  "Transporte Internacional",
  "Logística Integral",
  "Depósito y Almacenaje",
  "Trámites Aduaneros",
  "Carga Seca en General",
  "Carga por Metraje Cúbico",
  "Contenedores con y sin Carga",
];

export default function QuoteForm() {
  const [status, setStatus] = useState("idle");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    const form = e.target;
    const data = {
      nombre: form.nombre.value,
      empresa: form.empresa.value,
      email: form.email.value,
      telefono: form.telefono.value,
      servicio: form.servicio.value,
      descripcion: form.descripcion.value,
    };
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
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
    <form onSubmit={handleSubmit} className="bg-white/[0.04] border border-white/10">
      <div className="grid md:grid-cols-2">
        <DarkField label="Nombre y apellido *" name="nombre" required right />
        <DarkField label="Empresa" name="empresa" />
      </div>
      <div className="grid md:grid-cols-2">
        <DarkField label="E-mail *" name="email" type="email" required right />
        <DarkField label="Teléfono *" name="telefono" required />
      </div>
      <div className="border-b border-r-0 md:border-r border-white/10">
        <label className="block font-heading text-[11px] font-bold uppercase tracking-[0.25em] text-accent px-6 pt-6">
          Servicio *
        </label>
        <select
          name="servicio"
          required
          className="block w-full bg-transparent border-none outline-none px-6 pt-3 pb-7 font-body text-base font-light text-white"
        >
          <option className="bg-secondary" value="">Seleccionar servicio...</option>
          {SERVICIOS_OPCIONES.map((s) => (
            <option className="bg-secondary" key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block font-heading text-[11px] font-bold uppercase tracking-[0.25em] text-accent px-6 pt-6">
          Descripción de la carga *
        </label>
        <textarea
          name="descripcion"
          required
          rows={9}
          className="block w-full bg-transparent border-none outline-none resize-none px-6 pt-3 pb-7 font-body text-base font-light text-white min-h-[220px]"
        />
      </div>
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full py-6 font-heading text-sm font-bold uppercase tracking-[0.25em] text-primary bg-accent hover:brightness-95 transition-all disabled:opacity-60"
      >
        {status === "sending" ? "Enviando..." : "Enviar Cotización"}
      </button>
      {status === "success" && (
        <p className="text-accent text-sm font-body px-6 py-5">¡Gracias! Recibimos tu solicitud y te contactaremos a la brevedad.</p>
      )}
      {status === "error" && (
        <p className="text-red-300 text-sm font-body px-6 py-5">
          Hubo un problema al enviar. Escribinos directamente para completar tu cotización.
        </p>
      )}
    </form>
  );
}

function DarkField({ label, name, type = "text", required, right }) {
  return (
    <div className={`border-b border-white/10 ${right ? "md:border-r" : ""}`}>
      <label className="block font-heading text-[11px] font-bold uppercase tracking-[0.25em] text-accent px-6 pt-6">
        {label}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        className="block w-full bg-transparent border-none outline-none px-6 pt-3 pb-7 font-body text-base font-light text-white"
      />
    </div>
  );
}
