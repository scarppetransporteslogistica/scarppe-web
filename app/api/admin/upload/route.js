import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isValidToken, COOKIE_NAME } from "@/lib/auth";
import { UPLOADS_DIR, ensureBootstrap } from "@/lib/db";
import fs from "fs";
import path from "path";
import sharp from "sharp";

function isAuthed() {
  const token = cookies().get(COOKIE_NAME)?.value;
  return isValidToken(token);
}

// Fotos de más de este ancho se achican (siguen viéndose nítidas en cualquier pantalla,
// pero pesan mucho menos y consumen menos ancho de banda de Render).
const MAX_WIDTH = 2200;

async function compressIfImage(bytes, ext) {
  const rasterExt = ["jpg", "jpeg", "png", "webp"];
  if (!rasterExt.includes(ext)) return bytes; // SVG, GIF, etc: se guardan tal cual

  try {
    let img = sharp(bytes, { failOn: "none" }).rotate(); // respeta la orientación EXIF del celular
    const meta = await img.metadata();
    if (meta.width && meta.width > MAX_WIDTH) {
      img = img.resize({ width: MAX_WIDTH, withoutEnlargement: true });
    }

    if (ext === "png") {
      return await img.png({ quality: 82, compressionLevel: 9 }).toBuffer();
    }
    if (ext === "webp") {
      return await img.webp({ quality: 82 }).toBuffer();
    }
    // jpg / jpeg
    return await img.jpeg({ quality: 82, mozjpeg: true }).toBuffer();
  } catch (err) {
    // Si por algún motivo la imagen no se puede procesar (archivo corrupto, formato raro),
    // se guarda el original sin comprimir en vez de romper la subida.
    console.error("No se pudo comprimir la imagen, se guarda original:", err);
    return bytes;
  }
}

export async function POST(request) {
  if (!isAuthed()) return NextResponse.json({ ok: false }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file");
  if (!file || typeof file !== "object") {
    return NextResponse.json({ ok: false, message: "Archivo no recibido" }, { status: 400 });
  }

  const originalBytes = Buffer.from(await file.arrayBuffer());
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "-");
  const ext = (safeName.split(".").pop() || "").toLowerCase();
  const filename = `${Date.now()}-${safeName}`;

  const finalBytes = await compressIfImage(originalBytes, ext);

  ensureBootstrap();
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  fs.writeFileSync(path.join(UPLOADS_DIR, filename), finalBytes);

  return NextResponse.json({ ok: true, url: `/uploads/${filename}` });
}
