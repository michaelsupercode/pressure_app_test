import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDirectory = path.resolve(__dirname, "../data");
const dataFile = path.resolve(dataDirectory, "readings.json");

async function ensureStoreExists() {
  await fs.mkdir(dataDirectory, { recursive: true });

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

export async function createReading(input) {
  const rows = await readRaw();
  const nextId = rows.length === 0 ? 1 : Math.max(...rows.map((row) => row.id || 0)) + 1;

  const row = {
    id: nextId,
    systolic: input.systolic,
    diastolic: input.diastolic,
    heartRate: input.heartRate ?? null,
    notes: input.notes ?? null,
    timestamp: new Date().toISOString()
  };

  rows.push(row);
  await writeRaw(rows);
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
