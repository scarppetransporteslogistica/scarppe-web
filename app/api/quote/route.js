import { NextResponse } from "next/server";
import { getContent } from "@/lib/db";
import { mailerConfigured, sendFormMail, saveSubmission } from "@/lib/mailer";

export const runtime = "nodejs";

const clip = (v, n = 5000) => String(v ?? "").trim().slice(0, n);

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Datos inválidos." }, { status: 400 });
  }

  // Honeypot: real visitors never see/fill this field; bots usually do.
  if (body.website) return NextResponse.json({ ok: true });

  const data = {
    nombre: clip(body.nombre, 200),
    empresa: clip(body.empresa, 200),
    email: clip(body.email, 200),
    telefono: clip(body.telefono, 100),
    servicio: clip(body.servicio, 200),
    descripcion: clip(body.descripcion),
  };
  if (!data.nombre || !data.email || !data.telefono || !data.servicio || !data.descripcion) {
    return NextResponse.json({ ok: false, message: "Faltan campos obligatorios." }, { status: 400 });
  }

  saveSubmission("cotizaciones", data);

  // Gmail not configured yet in Render → tell the browser to use the old
  // Web3Forms path so quotes keep arriving during the switch-over.
  if (!mailerConfigured()) {
    return NextResponse.json({ ok: false, fallback: true }, { status: 503 });
  }

  try {
    const content = getContent();
    await sendFormMail({
      subject: `Nueva cotización — ${data.servicio}`,
      replyTo: data.email,
      title: "Nueva solicitud de cotización",
      extraTo: content?.pages?.contacto?.quoteEmail,
      rows: [
        ["Nombre", data.nombre],
        ["Empresa", data.empresa],
        ["E-mail", data.email],
        ["Teléfono", data.telefono],
        ["Servicio", data.servicio],
        ["Descripción de la carga", data.descripcion],
      ],
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[cotización] error al enviar mail", err);
    return NextResponse.json({ ok: false, fallback: true }, { status: 502 });
  }
}
