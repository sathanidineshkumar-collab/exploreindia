export default async function handler(req: any, res: any) {
  try {
    const { default: app } = await import("../backend/src/app");
    return app(req, res);
  } catch (error: any) {
    console.error("Serverless Function Load Error:", error);
    return res.status(500).json({
      error: "Serverless Function Load Error",
      message: error?.message,
      stack: error?.stack
    });
  }
}
