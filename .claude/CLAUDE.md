# langchain-express-boot 项目速查

## 项目概述
- **类型**: LangChain + Express 后端启动模板
- **架构**: 约定优于配置，按功能分层
- **语言**: TypeScript (Node.js)

## 目录结构
```
langchain-express-boot/
├── agent/              # AI Agent 模块
│   ├── llm/           # LLM 配置 (deepseek.ts)
│   ├── prompt/        # Prompt 模板
│   ├── service/       # Agent 服务 (weather.ts - 提取昵称、查天气)
│   └── tool/          # LangChain 工具 (weather_tool.ts)
│
├── app/               # 应用核心
│   ├── controller/    # 控制器层 (请求处理、参数校验)
│   ├── middleware/    # 中间件 (error_handler.ts - HttpError, errorHandler)
│   ├── model/         # Sequelize 模型 (user.ts, dept.ts, _index.ts - 关联 & 初始化)
│   ├── router/        # Express 路由 (index.ts - 路由注册, user.ts - 路由定义)
│   ├── schedule/      # 定时任务
│   ├── service/       # 业务逻辑层 (调用 agent、查询数据库)
│   └── utils/         # 工具函数
│
├── config/            # 配置文件 (按环境分 dev/prod/test)
│   ├── _index.ts      # 统一配置出口 (根据 NODE_ENV 加载对应环境配置)
│   ├── constant.ts    # 常量
│   └── enums.ts       # 枚举 (Enum 类 + USER.BELONG_PLACE_TO_CITY 等)
│
├── lib/               # 库文件 (agent_config.example - LLM 配置模板)
├── utils/             # 全局工具 (tools.ts - numParam)
└── index.ts           # 入口文件
```

## 核心模式

### 1. 路由层
- 文件: `app/router/{module}.ts`
- 模式: 定义路由，用 `wrap` 函数捕获错误
```ts
function userRouter() {
  const r = Router();
  r.get("/", wrap(userList));
  r.get("/:id", wrap(userGet));
  return r;
}
function wrap(fn: any) {
  return (req: any, res: any, next: any) => Promise.resolve(fn(req, res)).catch(next);
}
```

### 2. 控制器层
- 文件: `app/controller/{module}.ts`
- 模式: 处理请求、参数校验、调用 service
```ts
import { HttpError } from "../middleware/error_handler";
import { listUsers } from "../service/user";
async function userList(req: Request, res: Response) {
  const data = await listUsers();
  res.json({ success: true, data });
}
```

### 3. 服务层
- 文件: `app/service/{module}.ts`
- 模式: 业务逻辑，调用 agent/model，抛出 HttpError
```ts
async function getWeatherByMessage(message: string) {
  const nickName = await extractEmployeeNickName(message);
  const user = await User.findOne({ where: { nickName } });
  if (!user) throw new HttpError(404, "user not found");
  // ...
}
```

### 4. 数据模型层
- 文件: `app/model/{module}.ts` 和 `_index.ts`
- 模式: Sequelize 模型定义 + 关联关系
```ts
// _index.ts 中定义关联
User.belongsTo(Dept, { foreignKey: "deptId", as: "dept" });
Dept.hasMany(User, { foreignKey: "deptId", as: "users" });
```

### 5. Agent 层
- 文件: `agent/service/{domain}.ts`, `agent/llm/*.ts`, `agent/tool/*.ts`
- 模式: LLM 调用、工具定义、Agent 编排
```ts
// 创建 LLM
import { createDeepSeekLLM } from "../llm/deepseek";
const llm = createDeepSeekLLM();

// 创建 Agent with tools
import { createAgent } from "langchain";
const agent = createAgent({ model: llm, tools });
```

### 6. 错误处理
- 文件: `app/middleware/error_handler.ts`
- 模式: 使用 HttpError 类抛出错误，errorHandler 中间件统一处理
```ts
throw new HttpError(404, "user not found");
throw new HttpError(400, "missing fields");
```

### 7. 配置加载
- 文件: `config/_index.ts`
- 模式: 根据 NODE_ENV 加载 dev/prod/test 配置
```ts
import { databaseConfig, deepseekConfig, enums } from "../config/_index";
```

## API 响应格式
```json
{
  "success": true,
  "data": { ... }
}
// 或
{
  "success": false,
  "message": "error message"
}
```

## 环境变量
- `NODE_ENV`: development | production | test
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASS`
- LLM 配置在 `config/dev/agent_config.ts` 中

## 命名约定
- 变量/函数: `camelCase`
- 类型/类/接口: `PascalCase`
- 常量: `UPPER_SNAKE_CASE`
- 文件: 按模块语义命名

## 快速命令
```bash
npm run dev          # 开发环境
npm run build        # 构建
npm run lint:fix     # 格式化
```

## 关键文件位置
- 入口: [index.ts](index.ts)
- 路由注册: [app/router/index.ts](app/router/index.ts)
- 错误处理: [app/middleware/error_handler.ts](app/middleware/error_handler.ts)
- 配置入口: [config/_index.ts](config/_index.ts)
- 枚举定义: [config/enums.ts](config/enums.ts)
- 用户服务示例: [app/service/user.ts](app/service/user.ts)
- 用户控制器示例: [app/controller/user.ts](app/controller/user.ts)
- Agent 服务示例: [agent/service/weather.ts](agent/service/weather.ts)
- LLM 配置: [agent/llm/deepseek.ts](agent/llm/deepseek.ts)
