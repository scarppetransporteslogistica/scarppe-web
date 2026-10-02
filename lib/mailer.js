import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { DATA_DIR } from "@/lib/db";

// Sends the website's form e-mails straight from the company's own Gmail
// account — no Web3Forms or any other third-party service in between.
//
// Configure in Render → the web service → Environment:
//   GMAIL_USER          the Gmail address (e.g. scarppe.web@gmail.com)
//   GMAIL_APP_PASSWORD  a 16-character Google "App password" for that
//                       account (NOT the normal Gmail password; created at
//                       myaccount.google.com → Security → App passwords,
//                       which requires 2-Step Verification to be on).
//
// Every e-mail always goes to GMAIL_USER. If an extra address is filled in
// the admin panel (Contacto / Trabaja con Nosotros), it gets a copy too.

export function mailerConfigured() {
  return Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
}

let transporter = null;
function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: String(process.env.GMAIL_APP_PASSWORD || "").replace(/\s+/g, ""),
      },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 20000,
    });
  }
  return transporter;
}

export function escapeHtml(v) {
  return String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Builds a simple, readable HTML table from [label, value] pairs.
export function fieldsToHtml(title, rows) {
  const trs = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;font-weight:bold;vertical-align:top;white-space:nowrap">${escapeHtml(k)}</td>` +
        `<td style="padding:8px 12px;border-bottom:1px solid #eee;white-space:pre-wrap">${escapeHtml(v || "—")}</td></tr>`
    )
    .join("");
  return `<div style="font-family:Arial,sans-serif;font-size:14px;color:#191D33">
<h2 style="margin:0 0 12px">${escapeHtml(title)}</h2>
<table style="border-collapse:collapse;width:100%;max-width:640px">${trs}</table>
<p style="color:#888;font-size:12px;margin-top:16px">Enviado desde el formulario de scarppe.com.uy. Respondé este mail para contestarle directamente al cliente.</p>
</div>`;
}

export function fieldsToText(title, rows) {
  return `${title}\n\n` + rows.map(([k, v]) => `${k}: ${v || "—"}`).join("\n");
}

export async function sendFormMail({ subject, replyTo, title, rows, extraTo, attachments }) {
  const user = process.env.GMAIL_USER;
  const cc =
    extraTo && String(extraTo).trim() && String(extraTo).trim().toLowerCase() !== user.toLowerCase()
      ? String(extraTo).trim()
      : undefined;
  await getTransporter().sendMail({
    from: `"Sitio web Scarppe" <${user}>`,
    to: user,
    cc,
    replyTo: replyTo || undefined,
    subject,
    text: fieldsToText(title, rows),
    html: fieldsToHtml(title, rows),
    attachments,
  });
}

// Safety net: every submission is also written to a file on the server's
// disk, so nothing is lost even if an e-mail fails to go out.
export function saveSubmission(kind, data) {
  try {
    const dir = path.join(DATA_DIR, "formularios");
    fs.mkdirSync(dir, { recursive: true });
    fs.appendFileSync(
      path.join(dir, `${kind}.jsonl`),
      JSON.stringify({ fecha: new Date().toISOString(), ...data }) + "\n"
    );
  } catch (err) {
    console.error("[formularios] no se pudo guardar respaldo", err);
  }
}
