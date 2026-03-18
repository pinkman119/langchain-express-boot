import { sequelize } from "../../config/_index";
import { Dept } from "./dept";
import { User } from "./user";

// Associations
User.belongsTo(Dept, { foreignKey: "deptId", as: "dept" });
Dept.hasMany(User, { foreignKey: "deptId", as: "users" });

export async function initDb() {
  await sequelize.authenticate();

  // 默认不做自动建表/改表，避免影响已有数据库
  // 如需让 Sequelize 按模型创建表，可手动开启：
  // await sequelize.sync({ alter: false });
}

export { sequelize, Dept, User };
