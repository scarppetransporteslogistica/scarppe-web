import fs from "fs";
import path from "path";

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "render-data");
const CONTENT_PATH = path.join(DATA_DIR, "content.json");
const UPLOADS_DIR = path.join(DATA_DIR, "uploads");

const SEED_CONTENT_PATH = path.join(process.cwd(), "seed", "content.json");
const SEED_UPLOADS_DIR = path.join(process.cwd(), "seed", "uploads");

function copyDirRecursive(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function ensureBootstrap() {
  fs.mkdirSync(DATA_DIR, { recursive: true });

  if (!fs.existsSync(CONTENT_PATH)) {
    fs.copyFileSync(SEED_CONTENT_PATH, CONTENT_PATH);
  }

  if (!fs.existsSync(UPLOADS_DIR)) {
    copyDirRecursive(SEED_UPLOADS_DIR, UPLOADS_DIR);
  }
}

// Category inference for the original 8 services, used to backfill/repair
// data on deployments whose persisted content.json predates the "categoria"
// field, or where a service was later renamed in the admin (which also
// regenerates its slug, so a plain slug lookup alone isn't reliable).
const KNOWN_TRANSPORTE_SLUGS = new Set([
  "transporte-nacional",
  "transporte-internacional",
  "carga-seca-en-general",
  "carga-por-metraje-cubico",
  "contenedores-con-y-sin-carga",
]);
const KNOWN_LOGISTICA_SLUGS = new Set([
  "logistica-integral",
  "deposito-y-almacenaje",
  "tramites-aduaneros",
]);
// Name-based fallback (accent-insensitive) for renamed services.
const LOGISTICA_NAME_HINTS = ["logistic", "deposit", "almacenaj", "aduaner"];
const TRANSPORTE_NAME_HINTS = ["transporte", "carga", "contenedor"];

function normalize(str) {
  return (str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

// Returns "transporte" / "logistica" when confidently recognized, or null
// when this looks like a genuinely custom/new service we shouldn't touch.
function inferKnownCategory(s) {
  if (KNOWN_TRANSPORTE_SLUGS.has(s.slug)) return "transporte";
  if (KNOWN_LOGISTICA_SLUGS.has(s.slug)) return "logistica";
  const name = normalize(s.nombre);
  if (LOGISTICA_NAME_HINTS.some((hint) => name.includes(hint))) return "logistica";
  if (TRANSPORTE_NAME_HINTS.some((hint) => name.includes(hint))) return "transporte";
  return null;
}

function migrateContent(content) {
  let changed = false;

  if (Array.isArray(content.servicios)) {
    content.servicios = content.servicios.map((s) => {
      const known = inferKnownCategory(s);
      if (known && s.categoria !== known) {
        changed = true;
        return { ...s, categoria: known };
      }
      if (!known && !s.categoria) {
        changed = true;
        return { ...s, categoria: "transporte" };
      }
      return s;
    });
  }

  if (changed) {
    fs.writeFileSync(CONTENT_PATH, JSON.stringify(content, null, 2), "utf-8");
  }

  return content;
}

export function getContent() {
  ensureBootstrap();
  const raw = fs.readFileSync(CONTENT_PATH, "utf-8");
  return migrateContent(JSON.parse(raw));
}

export function saveContent(content) {
  ensureBootstrap();
  fs.writeFileSync(CONTENT_PATH, JSON.stringify(content, null, 2), "utf-8");
  return content;
}

export function updateContent(partialUpdater) {
  const current = getContent();
  const updated = partialUpdater(current);
  return saveContent(updated);
}

export { DATA_DIR, UPLOADS_DIR, ensureBootstrap };
