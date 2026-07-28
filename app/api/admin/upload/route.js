import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isValidToken, COOKIE_NAME } from "@/lib/auth";
import { UPLOADS_DIR, ensureBootstrap } from "@/lib/db";
import fs from "fs";
import path from "path";

function isAuthed() {
  const token = cookies().get(COOKIE_NAME)?.value;
  return isValidToken(token);
}

export async function POST(request) {
  if (!isAuthed()) return NextResponse.json({ ok: false }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file");
  if (!file || typeof file !== "object") {
    return NextResponse.json({ ok: false, message: "Archivo no recibido" }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "-");
  const filename = `${Date.now()}-${safeName}`;
  ensureBootstrap();
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  fs.writeFileSync(path.join(UPLOADS_DIR, filename), bytes);

  return NextResponse.json({ ok: true, url: `/uploads/${filename}` });
}
