/**
 * 统一配置出口：
 * - 所有业务代码只从 `config/_index.ts` 获取配置
 * - 根据 NODE_ENV 自动选择 dev / prod / test
 *
 * 注意：这里使用按需 require，避免同时加载多个环境配置导致副作用（比如创建多个 Sequelize 连接）。
 */

export type RuntimeEnvName = "dev" | "prod" | "test";

function resolveEnvName(nodeEnv: string | undefined): RuntimeEnvName {
  const v = (nodeEnv ?? "").toLowerCase().trim();

  // 常见写法：development / production / test
  if (v === "production" || v === "prod") return "prod";
  if (v === "test") return "test";

  // 兼容：dev / development / 空
  return "dev";
}

export const ENV: RuntimeEnvName = resolveEnvName(process.env.NODE_ENV);

type EnvDbModule = typeof import("./dev/database");

function loadEnvConfig(env: RuntimeEnvName, configName: string): EnvDbModule {
  switch (env) {
    case "prod":
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      return require(`./prod/${configName}`);
    case "test":
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      return require(`./test/${configName}`);
    case "dev":
    default:
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      return require(`./dev/${configName}`);
  }
}
// 导出database.ts
const envDb = loadEnvConfig(ENV, "database");
export const databaseConfig = envDb.databaseConfig;
export const sequelize = envDb.sequelize;
// 导出constant和enums（不受环境影响）
export { constant } from "./constant";
export { enums } from "./enums";

export default envDb;
