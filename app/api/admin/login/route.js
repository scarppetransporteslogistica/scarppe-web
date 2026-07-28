import { NextResponse } from "next/server";
import { checkPassword, expectedToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(request) {
  const { password } = await request.json();
  if (!checkPassword(password)) {
    return NextResponse.json({ ok: false, message: "Contraseña incorrecta" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, expectedToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return res;
}
