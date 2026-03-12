# Pressure Backend

Simple Express backend for blood pressure readings.

## Features

- `GET /api/readings` list all readings (newest first)
- `POST /api/readings` create a reading
- `DELETE /api/readings/:id` delete a reading
- JSON file persistence in `backend/data/readings.json`

## Run

1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env` and adjust values if needed
4. `npm run dev`

## Request body for `POST /api/readings`

```json
{
  "systolic": 120,
  "diastolic": 80,
  "heartRate": 72,
  "notes": "After morning walk"
}
```

- `heartRate` can be `null`
- `notes` can be `null`
