import { NextResponse } from "next/server";
import { UPLOADS_DIR } from "@/lib/db";
import fs from "fs";
import path from "path";

// Only stores the uploaded CV PDF and returns its public link. The e-mail
// itself is now sent from the visitor's browser (see components/CVForm.js),
// because Web3Forms' free plan blocks server-to-server submissions.
//
// The link must be absolute (https://scarppe.com.uy/uploads/...) so it's
// clickable from the inbox. Built from a fixed constant because on Render
// `new URL(request.url).origin` resolves to "localhost". Override with the
// SITE_URL env var in Render if the domain ever changes.
const MAX_BYTES = 10 * 1024 * 1024;

export async function POST(request) {
  try {
    const formData = await request.formData();
    const cv = formData.get("cv");
    if (!cv || typeof cv !== "object") {
      return NextResponse.json({ ok: false, message: "Falta el archivo." }, { status: 400 });
    }
    if (cv.size > MAX_BYTES) {
      return NextResponse.json({ ok: false, message: "El archivo es demasiado grande." }, { status: 413 });
    }
    const isPdf = (cv.type === "application/pdf") || /\.pdf$/i.test(cv.name || "");
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
    return NextResponse.json({ ok: true, cvUrl: `${siteOrigin}/uploads/cv/${filename}` });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
