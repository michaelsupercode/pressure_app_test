export interface Reading {
  id: number;
  systolic: number;
  diastolic: number;
  heartRate: number | null;
  notes: string | null;
  timestamp: string | Date;
}

export interface InsertReading {
  systolic: number;
  diastolic: number;
  heartRate?: number | null;
  notes?: string | null;
}
