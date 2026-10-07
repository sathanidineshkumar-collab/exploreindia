import express from "express";
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

// Mount API routes for both direct /api calls and serverless rewrites
app.use("/api", apiRoutes);
app.use(apiRoutes);

// Central error handler
app.use(errorHandler);

// Export default standard handler for serverless runtimes (Vercel, AWS Lambda)
export default function handler(req: any, res: any) {
  return app(req, res);
}
