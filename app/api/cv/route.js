import { NextResponse } from "next/server";
import { getContent, UPLOADS_DIR } from "@/lib/db";
import { mailerConfigured, sendFormMail, saveSubmission } from "@/lib/mailer";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

const MAX_BYTES = 10 * 1024 * 1024;
const clip = (v, n = 5000) => String(v ?? "").trim().slice(0, n);

// The CV PDF is stored on the server (so there's always a copy and a link)
// AND attached directly to the e-mail sent from the company's Gmail.
// The link is built from a fixed domain because on Render
// `new URL(request.url).origin` resolves to "localhost".
export async function POST(request) {
  try {
    const formData = await request.formData();
    if (formData.get("website")) return NextResponse.json({ ok: true }); // honeypot

    const data = {
      nombre: clip(formData.get("nombre"), 200),
      email: clip(formData.get("email"), 200),
      telefono: clip(formData.get("telefono"), 100),
      mensaje: clip(formData.get("mensaje")),
    };
    const cv = formData.get("cv");
    if (!data.nombre || !data.email) {
      return NextResponse.json({ ok: false, message: "Faltan campos obligatorios." }, { status: 400 });
    }

    let cvUrl = "";
    let attachment = null;
    if (cv && typeof cv === "object" && cv.size > 0) {
      if (cv.size > MAX_BYTES) {
        return NextResponse.json({ ok: false, message: "El archivo es demasiado grande (máx. 10 MB)." }, { status: 413 });
      }
      const isPdf = cv.type === "application/pdf" || /\.pdf$/i.test(cv.name || "");
      if (!isPdf) {
        return NextResponse.json({ ok: false, message: "Solo se aceptan archivos PDF." }, { status: 400 });
      }
      const siteOrigin = (process.env.SITE_URL || "https://scarppe.com.uy").replace(/\/$/, "");
      const bytes = Buffer.from(await cv.arrayBuffer());
      const safeName = path.basename(cv.name || "cv.pdf").replace(/[^\w.\-]+/g, "-");
      const filename = `cv-${Date.now()}-${safeName}`;
      const uploadDir = path.join(UPLOADS_DIR, "cv");
      fs.mkdirSync(uploadDir, { recursive: true });
      fs.writeFileSync(path.join(uploadDir, filename), bytes);
      cvUrl = `${siteOrigin}/uploads/cv/${filename}`;
      attachment = { filename: safeName, content: bytes, contentType: "application/pdf" };
    }

    saveSubmission("curriculums", { ...data, cvUrl });

    // Gmail not set up yet in Render → return the link and let the browser
    // fall back to Web3Forms so CVs keep arriving during the switch-over.
    if (!mailerConfigured()) {
      return NextResponse.json({ ok: false, fallback: true, cvUrl });
    }

    const content = getContent();
    const rows = [
      ["Nombre", data.nombre],
      ["E-mail", data.email],
      ["Teléfono", data.telefono],
      ["Mensaje", data.mensaje],
      ["CV (también va adjunto)", cvUrl || "No adjuntado"],
    ];
    try {
      await sendFormMail({
        subject: `Nuevo currículum — ${data.nombre}`,
        replyTo: data.email,
        title: "Nuevo currículum recibido",
        extraTo: content?.pages?.trabajaConNosotros?.cvEmail,
        rows,
        attachments: attachment ? [attachment] : undefined,
      });
    } catch (err) {
      console.error("[cv] error al enviar mail", err);
      return NextResponse.json({ ok: false, fallback: true, cvUrl });
    }
    return NextResponse.json({ ok: true, cvUrl });
  } catch (err) {
    console.error("[cv] error", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
