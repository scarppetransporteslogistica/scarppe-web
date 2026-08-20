import { NextResponse } from "next/server";
import { getContent, UPLOADS_DIR } from "@/lib/db";
import fs from "fs";
import path from "path";

export async function POST(request) {
  const formData = await request.formData();
  const content = getContent();
  const key = content.settings.web3formsKeyTrabajo;
  const toEmail = content.pages.trabajaConNosotros.cvEmail;

  const nombre = formData.get("nombre");
  const email = formData.get("email");
  const telefono = formData.get("telefono");
  const mensaje = formData.get("mensaje");
  const cv = formData.get("cv");

  // The email only ever contains a link to the PDF, not the file itself —
  // actual attachments are a paid-plan-only Web3Forms feature. That link
  // has to be a full, absolute URL (https://scarppe.com.uy/uploads/...)
  // so it's clickable straight from the inbox; a bare server path like
  // "/uploads/cv/archivo.pdf" (what this used to send) means nothing
  // outside the site and can't be opened by whoever receives the email.
  // NOTE: this used to be built from `new URL(request.url).origin`, but
  // in production that resolved to "localhost" instead of the real
  // domain — Render's proxy doesn't hand Next.js a Host header that
  // matches the public address in this setup. Using a fixed constant
  // sidesteps that entirely. Override with the SITE_URL env var in
  // Render (Settings > Environment) if the domain ever changes again,
  // otherwise it falls back to the current custom domain.
  const siteOrigin = (process.env.SITE_URL || "https://scarppe.com.uy").replace(/\/$/, "");
  let cvUrl = "";
  if (cv && typeof cv === "object") {
    const bytes = Buffer.from(await cv.arrayBuffer());
    const filename = `cv-${Date.now()}-${cv.name}`.replace(/\s+/g, "-");
    const uploadDir = path.join(UPLOADS_DIR, "cv");
    fs.mkdirSync(uploadDir, { recursive: true });
    fs.writeFileSync(path.join(uploadDir, filename), bytes);
    cvUrl = `${siteOrigin}/uploads/cv/${filename}`;
  }

  if (!key) {
    console.log("[CV recibido - sin servicio de envío configurado]", { toEmail, nombre, email, telefono, mensaje, cvUrl });
    return NextResponse.json({ ok: false, message: "Servicio de envío no configurado todavía." }, { status: 200 });
  }

  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: key,
        subject: `Nuevo currículum — ${nombre}`,
        from_name: "Sitio web Scarppe",
        replyto: email,
        Nombre: nombre,
        Email: email,
        Telefono: telefono,
        Mensaje: mensaje,
        "Archivo CV (hacé clic para abrir/descargar)": cvUrl || "No adjuntado",
      }),
    });
    const data = await res.json();
    if (!data.success) return NextResponse.json({ ok: false }, { status: 502 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
