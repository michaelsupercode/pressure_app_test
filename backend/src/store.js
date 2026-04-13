import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

function resolveFromProjectRoot(targetPath) {
  if (!targetPath) {
    return null;
  }

  return path.isAbsolute(targetPath)
    ? path.resolve(targetPath)
    : path.resolve(projectRoot, targetPath);
}

const dataDirectory = resolveFromProjectRoot(process.env.DATA_DIR) ?? path.resolve(projectRoot, "data");

const dataFile = resolveFromProjectRoot(process.env.DATA_FILE) ?? path.resolve(dataDirectory, "readings.json");

const dataFileDirectory = path.dirname(dataFile);

export function getStoreInfo() {
  return {
    dataFile,
    dataDirectory,
    source: process.env.DATA_FILE ? "DATA_FILE" : process.env.DATA_DIR ? "DATA_DIR" : "default"
  };
}

async function ensureStoreExists() {
  await fs.mkdir(dataFileDirectory, { recursive: true });

  try {
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(dataFile, "[]", "utf8");
  }
}

async function readRaw() {
  await ensureStoreExists();
  const content = await fs.readFile(dataFile, "utf8");

  try {
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeRaw(rows) {
  await ensureStoreExists();
  await fs.writeFile(dataFile, JSON.stringify(rows, null, 2), "utf8");
}

export async function getAllReadings() {
  const rows = await readRaw();
  return rows.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

const MAX_ENTRIES = 50;

export async function createReading(input) {
  const rows = await readRaw();
  const nextId = rows.length === 0 ? 1 : rows.reduce((max, row) => Math.max(max, row.id || 0), 0) + 1;

  const row = {
    id: nextId,
    systolic: input.systolic,
    diastolic: input.diastolic,
    heartRate: input.heartRate ?? null,
    notes: input.notes ?? null,
    timestamp: new Date().toISOString()
  };

  rows.push(row);

  const trimmed = rows
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, MAX_ENTRIES);

  await writeRaw(trimmed);
  return row;
}

export async function deleteReadingById(id) {
  const rows = await readRaw();
  const initialLength = rows.length;
  const updated = rows.filter((row) => row.id !== id);

  if (updated.length === initialLength) {
    return false;
  }

  await writeRaw(updated);
  return true;
}
