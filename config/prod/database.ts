import { Sequelize } from "sequelize";

export type DatabaseConfig = {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  dialect: "mysql";
  timezone?: string;
  logging?: boolean;
};

/**
 * 生产环境建议通过环境变量注入：
 * - DB_HOST / DB_PORT / DB_NAME / DB_USER / DB_PASS
 */
export const databaseConfig: DatabaseConfig = {
  host: process.env.DB_HOST ?? "127.0.0.1",
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  database: process.env.DB_NAME ?? "ehr_prod",
  username: process.env.DB_USER ?? "root",
  password: process.env.DB_PASS ?? "password",
  dialect: "mysql",
  timezone: process.env.DB_TIMEZONE ?? "+08:00",
  logging: process.env.DB_LOGGING?.toLowerCase() === "true",
};

export const sequelize = new Sequelize(
  databaseConfig.database,
  databaseConfig.username,
  databaseConfig.password,
  {
    host: databaseConfig.host,
    port: databaseConfig.port,
    dialect: databaseConfig.dialect,
    timezone: databaseConfig.timezone,
    logging: databaseConfig.logging ? console.log : false,
  },
);
