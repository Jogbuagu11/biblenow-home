export function getAppBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_APP_URL;
  if (typeof url === "string" && url.trim()) {
    return url.trim().replace(/\/+$/, "");
  }
  return "";
}

export function getAuthUrl(): string {
  const base = getAppBaseUrl();
  return base ? base + "/auth" : "/auth";
}

export function getAppHomeUrl(): string {
  const base = getAppBaseUrl();
  return base ? base + "/app" : "/app";
}
