# Pressure Backend

Simple Express backend for blood pressure readings.

## Features

- `GET /api/readings` list all readings (newest first)
- `POST /api/readings` create a reading
- `DELETE /api/readings/:id` delete a reading
- `GET /api/health` includes active storage metadata for diagnostics
- JSON file persistence in `backend/data/readings.json`

## Persistence configuration

The backend supports custom storage paths:

- `DATA_DIR` directory that contains `readings.json`
- `DATA_FILE` full path to the JSON file (takes precedence over `DATA_DIR`)

For platforms with ephemeral filesystems (for example Render), set one of these to a mounted persistent disk path.

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
