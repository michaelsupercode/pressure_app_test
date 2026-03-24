## Packages
recharts | For building the beautiful blood pressure trend charts
date-fns | For formatting and displaying timestamps cleanly
clsx | For conditional class merging
tailwind-merge | For conditional class merging

## Notes
The backend provides endpoints for managing blood pressure readings.
All dates/timestamps from the backend need to be parsed properly on the frontend.

## API target behavior
- Production/static deploy: uses `VITE_API_URL`.
- Local `vite dev`: `/api` is proxied to `http://localhost:4000` by default.
- Optional override for local proxy target: `VITE_DEV_API_PROXY_TARGET`.
