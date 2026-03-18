import type { Express } from "express";
import { deptRouter } from "./dept";
import { userRouter } from "./user";

function registerRoutes(app: Express) {
  app.get("/health", (_req, res) => res.json({ ok: true }));
  app.use("/api/depts", deptRouter());
  app.use("/api/users", userRouter());
}

export { registerRoutes };
