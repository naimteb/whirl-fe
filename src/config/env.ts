/*
  Centralized access to Vite environment variables.
  Only variables prefixed with VITE_ are exposed to the client.
*/

export type AppEnvironment = "development" | "test" | "production";

function getString(value: string | undefined, fallback?: string): string | undefined {
  return value !== undefined && value !== "" ? value : fallback;
}

function getRequired(name: string, value: string | undefined): string {
  if (value === undefined || value === "") {
    throw new Error(`Missing required env variable: ${name}`);
  }
  return value;
}

const viteEnv = import.meta.env;

export const appEnv: AppEnvironment = (viteEnv.VITE_APP_ENV ?? viteEnv.MODE ?? "development") as AppEnvironment;

// Public API base URL used by the frontend to call the backend.
// Provide a sensible default for development; require it in non-dev.
const resolvedApiBaseUrl = getString(viteEnv.VITE_API_BASE_URL, appEnv === "development" ? "http://localhost:3001" : undefined);

export const apiBaseUrl: string = appEnv === "development"
  ? (resolvedApiBaseUrl as string)
  : getRequired("VITE_API_BASE_URL", resolvedApiBaseUrl);

export const env = {
  appEnv,
  apiBaseUrl,
} as const;

export default env;


