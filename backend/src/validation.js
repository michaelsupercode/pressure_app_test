import { z } from "zod";

export const createReadingSchema = z.object({
  systolic: z.number().int().min(50).max(300),
  diastolic: z.number().int().min(30).max(200),
  heartRate: z.number().int().min(30).max(250).nullable().optional(),
  notes: z.string().max(500).nullable().optional()
});

export function validateCreateReading(payload) {
  const parsed = createReadingSchema.safeParse(payload);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message
    }));

    return {
      ok: false,
      error: {
        message: "Invalid reading payload",
        issues
      }
    };
  }

  return { ok: true, data: parsed.data };
}
