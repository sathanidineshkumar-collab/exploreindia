import app from "./app";
import { ENV } from "./config/env";

const server = app.listen(ENV.PORT, "0.0.0.0", () => {
  console.log(`ExploreIndia backend running on http://localhost:${ENV.PORT}`);
});

export default server;
