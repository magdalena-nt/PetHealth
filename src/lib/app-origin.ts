import { APP_ORIGIN } from "astro:env/server";

export function getAppOrigin(): URL | null {
  if (!APP_ORIGIN) {
    return null;
  }

  try {
    const origin = new URL(APP_ORIGIN);
    if (
      origin.origin !== APP_ORIGIN ||
      (!import.meta.env.DEV && origin.protocol !== "https:") ||
      (import.meta.env.DEV && !["http:", "https:"].includes(origin.protocol))
    ) {
      return null;
    }

    return origin;
  } catch {
    return null;
  }
}
