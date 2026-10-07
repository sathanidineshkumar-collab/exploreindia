import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const getModuleDir = (): string => {
  try {
    if (typeof __dirname !== "undefined") return __dirname;
    if (typeof import.meta !== "undefined" && import.meta?.url) {
      return path.dirname(fileURLToPath(import.meta.url));
    }
  } catch {
    // ignore
  }
  return process.cwd();
};

const moduleDir = getModuleDir();

// Load environment variables reliably from backend or root directory
const possibleEnvPaths = [
  path.resolve(process.cwd(), ".env.local"),
  path.resolve(moduleDir, "../../.env.local"),
  path.resolve(moduleDir, "../../.env"),
  path.resolve(moduleDir, "../.env"),
  path.resolve(process.cwd(), ".env")
];

for (const envPath of possibleEnvPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  }
}
dotenv.config();

export const ENV = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  JWT_SECRET: process.env.JWT_SECRET || "explore_india_secret_key_1337",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
  APP_URL: process.env.APP_URL || "http://localhost:5000",
  GOOGLE_MAPS_PLATFORM_KEY: process.env.GOOGLE_MAPS_PLATFORM_KEY || "",
  NODE_ENV: process.env.NODE_ENV || "development",
};
