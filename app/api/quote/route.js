import { NextResponse } from "next/server";
import { getContent } from "@/lib/db";

export async function POST(request) {
  const body = await request.json();
  const content = getContent();
  const key = content.settings.web3formsKeyCotizacion;
  const toEmail = content.pages.contacto.quoteEmail;

  if (!key) {
    console.log("[Cotización recibida - sin servicio de envío configurado]", { toEmail, body });
    return NextResponse.json(
      { ok: false, message: "Servicio de envío no configurado todavía." },
      { status: 200 }
    );
  }

  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: key,
        subject: `Nueva cotización — ${body.servicio || "Sitio web Scarppe"}`,
        from_name: "Sitio web Scarppe",
        replyto: body.email,
        Nombre: body.nombre,
        Empresa: body.empresa,
        Email: body.email,
        Telefono: body.telefono,
        Servicio: body.servicio,
        "Descripción de la carga": body.descripcion,
      }),
    });
    const data = await res.json();
    if (!data.success) return NextResponse.json({ ok: false }, { status: 502 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
