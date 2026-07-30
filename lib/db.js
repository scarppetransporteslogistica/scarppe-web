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

// Slug -> category mapping used to backfill data on deployments whose
// persisted content.json predates the "categoria" field (added later).
// Without this, existing sites would show every servicio in one group
// forever, since their saved content.json never gets the new field.
const SERVICE_CATEGORY_BY_SLUG = {
  "transporte-nacional": "transporte",
  "transporte-internacional": "transporte",
  "carga-seca-en-general": "transporte",
  "carga-por-metraje-cubico": "transporte",
  "contenedores-con-y-sin-carga": "transporte",
  "logistica-integral": "logistica",
  "deposito-y-almacenaje": "logistica",
  "tramites-aduaneros": "logistica",
};

function migrateContent(content) {
  let changed = false;

  if (Array.isArray(content.servicios)) {
    content.servicios = content.servicios.map((s) => {
      if (s.categoria) return s;
      changed = true;
      return { ...s, categoria: SERVICE_CATEGORY_BY_SLUG[s.slug] || "transporte" };
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
