import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getContent, saveContent } from "@/lib/db";
import { isValidToken, COOKIE_NAME } from "@/lib/auth";

function isAuthed() {
  const token = cookies().get(COOKIE_NAME)?.value;
  return isValidToken(token);
}

export async function GET() {
  if (!isAuthed()) return NextResponse.json({ ok: false }, { status: 401 });
  return NextResponse.json(getContent());
}

export async function PUT(request) {
  if (!isAuthed()) return NextResponse.json({ ok: false }, { status: 401 });
  const body = await request.json();
  const saved = saveContent(body);
  return NextResponse.json({ ok: true, content: saved });
}
