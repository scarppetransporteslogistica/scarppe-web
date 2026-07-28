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

export function getContent() {
  ensureBootstrap();
  const raw = fs.readFileSync(CONTENT_PATH, "utf-8");
  return JSON.parse(raw);
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
