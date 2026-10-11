import express from "express";
import path from "path";
import fs from "fs";
import { ENV } from "./config/env";
import apiRoutes from "./routes";
import { errorHandler } from "./middleware/errorHandler";

export const app = express();

// Built-in CORS handler
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
  } else {
    res.header("Access-Control-Allow-Origin", "*");
  }
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-user-id");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health Check
app.get(["/api/health", "/health"], (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: ENV.NODE_ENV
  });
});

// Mount primary API routes for /api
app.use("/api", apiRoutes);

// Locate frontend build directory if compiled for production
function getDistDir(): string | null {
  const possiblePaths = [
    path.resolve(process.cwd(), "frontend/dist"),
    path.resolve(process.cwd(), "dist"),
    path.resolve(process.cwd(), "../dist"),
    path.resolve(process.cwd(), "../frontend/dist")
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p) && fs.existsSync(path.join(p, "index.html"))) {
      return p;
    }
  }
  return null;
}

const distDir = getDistDir();

// Development Landing Page template for browser traffic on port 5000
const devLandingHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ExploreIndia — Backend API Server</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #070235; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
    .card { background: #0f0a4a; border: 1px solid #1e1b64; border-radius: 20px; padding: 36px; max-width: 580px; width: 100%; box-shadow: 0 20px 40px rgba(0,0,0,0.4); text-align: center; }
    h1 { font-size: 26px; color: #34E0A1; margin: 12px 0 8px 0; }
    p { font-size: 14px; line-height: 1.6; color: #cbd5e1; margin: 8px 0; }
    .status { display: inline-block; padding: 6px 14px; background: rgba(52, 224, 161, 0.15); color: #34E0A1; border-radius: 9999px; font-weight: bold; font-size: 12px; border: 1px solid rgba(52, 224, 161, 0.3); }
    .btn { display: inline-block; padding: 14px 28px; background: #00AA6C; color: white; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 14px; margin-top: 18px; transition: background 0.2s; }
    .btn:hover { background: #008f5a; }
    .endpoints { text-align: left; background: #08032b; border-radius: 12px; padding: 16px; margin-top: 24px; font-family: monospace; font-size: 12px; line-height: 1.8; }
    .endpoints a { color: #f59e0b; text-decoration: none; font-weight: bold; }
    .endpoints a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="card">
    <div class="status">&#9679; Backend REST API Server Active</div>
    <h1>ExploreIndia Backend</h1>
    <p>You have accessed the ExploreIndia backend server listening on <strong>Port 5000</strong>.</p>
    <p>In development mode, the interactive React application is served by Vite on <strong>Port 3000</strong>.</p>
    <a href="http://localhost:3000" class="btn">&#128640; Open Web Application (http://localhost:3000)</a>
    <div class="endpoints">
      <strong>Available API Endpoints:</strong><br>
      &bull; <a href="/api/health">GET /api/health</a> &mdash; Health Check<br>
      &bull; <a href="/api/places">GET /api/places</a> &mdash; All Verified Places<br>
      &bull; <a href="/api/cities/trending">GET /api/cities/trending</a> &mdash; Trending Indian Cities<br>
      &bull; <a href="/api/hotels/famous">GET /api/hotels/famous</a> &mdash; Curated Stays &amp; Resorts
    </div>
  </div>
</body>
</html>`;

if (distDir) {
  // Production: Serve static assets
  app.use(express.static(distDir));

  // SPA fallback for browser requests (Accept: text/html)
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api") || req.path === "/health") {
      return next();
    }
    if (req.accepts("html")) {
      return res.sendFile(path.join(distDir, "index.html"));
    }
    next();
  });
}

// Fallback direct routes without /api prefix for API callers
app.use(apiRoutes);

// Development mode: browser guidance on port 5000
if (!distDir) {
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api") || req.path === "/health") {
      return next();
    }
    if (req.accepts("html")) {
      return res.send(devLandingHtml);
    }
    res.status(404).json({ error: "Endpoint not found on ExploreIndia API" });
  });
}

// Central error handler
app.use(errorHandler);

// Export default standard handler for serverless runtimes (Vercel, AWS Lambda)
export default function handler(req: any, res: any) {
  return app(req, res);
}
