import "dotenv/config";

/**
 * Validate required environment variables early.
 * This prevents silent runtime failures.
 */

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(` Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: Number(process.env.PORT ?? 3000),

  DATABASE_URL: requireEnv("DATABASE_URL"),

  FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN ?? "http://localhost:3222",
};
