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

  // Web3Forms used to have one shared access key for both the Cotización
  // and Trabaja con Nosotros forms. Since Web3Forms' free plan always
  // delivers to whichever email address the access key's account was
  // registered with (there's no working "send to a different address"
  // override on the free plan, confirmed by a real test), one shared key
  // means both forms land in the same inbox no matter what's configured
  // in Contacto/Trabaja con Nosotros. Deployments with the old single key
  // get migrated here: it becomes the Cotización key (keeping whatever
  // was already working), and the Trabaja con Nosotros key starts empty
  // until a second Web3Forms account (registered with the CV recipient's
  // email) is created and its key pasted in the panel.
  if (content.settings && content.settings.web3formsKey && !content.settings.web3formsKeyCotizacion) {
    content.settings = {
      ...content.settings,
      web3formsKeyCotizacion: content.settings.web3formsKey,
      web3formsKeyTrabajo: content.settings.web3formsKeyTrabajo || "",
    };
    changed = true;
  }

  // Contact phone numbers used to be two fixed fields ("gerencia" and
  // "logistica"), each with a hardcoded label in the page. Deployments
  // whose persisted content.json predates the switch to a free-form list
  // (so any number of phone contacts can be added, each with its own
  // title) get migrated here: their two existing numbers become the first
  // two entries of the new list, so nothing already published is lost.
  if (content.pages && content.pages.contacto && !Array.isArray(content.pages.contacto.contactosTelefono)) {
    const c = content.pages.contacto;
    const contactosTelefono = [];
    if (c.gerencia) contactosTelefono.push({ titulo: "Gerencia", telefono: c.gerencia });
    if (c.logistica) contactosTelefono.push({ titulo: "Logística", telefono: c.logistica });
    content.pages.contacto = { ...c, contactosTelefono };
    changed = true;
  }

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
