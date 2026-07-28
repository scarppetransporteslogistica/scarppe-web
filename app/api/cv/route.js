import { NextResponse } from "next/server";
import { getContent, UPLOADS_DIR } from "@/lib/db";
import fs from "fs";
import path from "path";

export async function POST(request) {
  const formData = await request.formData();
  const content = getContent();
  const key = content.settings.web3formsKey;
  const toEmail = content.pages.trabajaConNosotros.cvEmail;

  const nombre = formData.get("nombre");
  const email = formData.get("email");
  const telefono = formData.get("telefono");
  const mensaje = formData.get("mensaje");
  const cv = formData.get("cv");

  let cvUrl = "";
  if (cv && typeof cv === "object") {
    const bytes = Buffer.from(await cv.arrayBuffer());
    const filename = `cv-${Date.now()}-${cv.name}`.replace(/\s+/g, "-");
    const uploadDir = path.join(UPLOADS_DIR, "cv");
    fs.mkdirSync(uploadDir, { recursive: true });
    fs.writeFileSync(path.join(uploadDir, filename), bytes);
    cvUrl = `/uploads/cv/${filename}`;
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
        "Archivo CV": cvUrl ? `Adjunto guardado en el servidor: ${cvUrl}` : "No adjuntado",
        to: toEmail,
      }),
    });
    const data = await res.json();
    if (!data.success) return NextResponse.json({ ok: false }, { status: 502 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
