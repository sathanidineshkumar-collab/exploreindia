import { app } from "./app";
import { ENV } from "./config/env";

const server = app.listen(ENV.PORT, "0.0.0.0", () => {
  console.log(`ExploreIndia backend running on http://localhost:${ENV.PORT}`);
});

server.on("error", (err: any) => {
  if (err.code === "EADDRINUSE") {
    console.error(`\x1b[31m[ERROR] Port ${ENV.PORT} is already in use by another process.\x1b[0m`);
    console.error(`Please stop the process running on port ${ENV.PORT} or start with a different port (e.g. PORT=5001 npm run dev:backend).`);
    process.exit(1);
  } else {
    console.error("[ERROR] Backend server encountered an error:", err);
  }
});

export default server;
