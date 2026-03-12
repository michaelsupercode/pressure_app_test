type RouteDef = {
  method: "GET" | "POST" | "DELETE";
  path: string;
};

export const api = {
  readings: {
    list: { method: "GET", path: "/api/readings" } as RouteDef,
    create: { method: "POST", path: "/api/readings" } as RouteDef,
    delete: { method: "DELETE", path: "/api/readings/:id" } as RouteDef
  }
};

export function buildUrl(path: string, params: Record<string, string | number>) {
  let url = path;
  for (const [key, value] of Object.entries(params)) {
    url = url.replace(`:${key}`, encodeURIComponent(String(value)));
  }
  return url;
}
