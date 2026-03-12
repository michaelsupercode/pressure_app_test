import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";

import { getAllReadings, createReading, deleteReadingById } from "./store.js";
import { validateCreateReading } from "./validation.js";

const app = express();

const port = Number(process.env.PORT || 4000);
const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(morgan("dev"));
app.use(express.json());
app.use(
  cors({
    origin: clientOrigin,
    credentials: true
  })
);

app.get("/", (_, res) => {
  res.send("<h6>Pressure backend is running.</h6>");
});


app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "pressure-backend" });
});

app.get("/api/readings", async (_req, res, next) => {
  try {
    const rows = await getAllReadings();
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

app.post("/api/readings", async (req, res, next) => {
  try {
    const validation = validateCreateReading(req.body);
    if (!validation.ok) {
      return res.status(400).json(validation.error);
    }

    const created = await createReading(validation.data);
    return res.status(201).json(created);
  } catch (error) {
    return next(error);
  }
});

app.delete("/api/readings/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ message: "Reading id must be a positive integer" });
    }

    const deleted = await deleteReadingById(id);
    if (!deleted) {
      return res.status(404).json({ message: "Reading not found" });
    }

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(port, () => {
  console.log(`Pressure backend listening on http://localhost:${port}`);
  console.log(`CORS origin: ${clientOrigin}`);
});
