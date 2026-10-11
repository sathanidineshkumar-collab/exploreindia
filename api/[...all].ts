// Forward all requests to the pre-bundled ESM API entry point
// @ts-ignore
import handler from "./index.js";

export default function (req: any, res: any) {
  return handler(req, res);
}
