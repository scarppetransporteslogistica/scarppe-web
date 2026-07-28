import fs from "fs";
import path from "path";
import { UPLOADS_DIR } from "@/lib/db";

const MIME_TYPES = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".pdf": "application/pdf",
  ".mp4": "video/mp4",
};

export async function GET(request, { params }) {
  const segments = params.path || [];
  const relativePath = segments.join("/");

  const resolved = path.normalize(path.join(UPLOADS_DIR, relativePath));
  if (!resolved.startsWith(path.normalize(UPLOADS_DIR))) {
    return new Response("Not found", { status: 404 });
  }

  if (!fs.existsSync(resolved) || !fs.statSync(resolved).isFile()) {
    return new Response("Not found", { status: 404 });
  }

  const ext = path.extname(resolved).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";
  const buffer = fs.readFileSync(resolved);

  return new Response(buffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
