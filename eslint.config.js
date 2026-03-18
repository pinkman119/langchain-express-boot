const js = require("@eslint/js");
const tseslint = require("typescript-eslint");
const prettierPlugin = require("eslint-plugin-prettier");
const eslintConfigPrettier = require("eslint-config-prettier");

module.exports = [
  {
    // 配置文件本身用 CommonJS（require/module.exports），不参与业务 lint
    ignores: ["dist/**", "node_modules/**", "eslint.config.js"],
  },

  js.configs.recommended,

  ...tseslint.configs.recommended,

  // 禁用与 Prettier 冲突的规则
  eslintConfigPrettier,

  {
    files: ["**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      // 让 ESLint 报告 Prettier 格式问题（并可 --fix 自动修复）
      "prettier/prettier": "error",

      // 一些常用的 TS 约束（按需再加）
      // 该项目目前大量使用 any（Express handler / service 层），为避免阻塞格式化与自动修复，这里先关闭
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },

  // 仅对特定文件启用“冒号对齐”风格，避免与 Prettier 全局冲突
  {
    files: ["app/service/user.service.ts"],
    rules: {
      "key-spacing": [
        "error",
        {
          align: { beforeColon: false, afterColon: true, on: "colon" },
          multiLine: { beforeColon: false, afterColon: true },
          singleLine: { beforeColon: false, afterColon: true },
        },
      ],
    },
  },
];
