import express from "express";
import { registerRoutes } from "./app/router";
import { errorHandler } from "./app/middleware/error_handler";
import { initDb } from "./app/model/_index";

async function main() {
  const app = express();

  app.use(express.json({ limit: "2mb" }));

  registerRoutes(app);
  app.use(errorHandler);

  const port = Number(process.env.PORT ?? "3000");

  app.listen(port, () => {
    console.log(`[server] listening on http://localhost:${port}`);
  });

  // DB init (connect + model sync optional)
  // 注意：为了让服务在未配置数据库时也能先起来，这里不阻塞启动流程
  initDb()
    .then(() => {
      console.log("[db] connected");
    })
    .catch((err) => {
      console.error("[db] connect failed (set DB_* env vars to fix):", err?.message ?? err);
    });
}

main().catch((err) => {
  console.error("[fatal]", err);
  process.exit(1);
});
