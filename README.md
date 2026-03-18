# langchain-express-boot

基于“约定优于配置”思想，结合langchain.js框架和express.js框架打造的快速开发boot启动模板

# 自动格式化
1. 配置.VSCODE配置
```
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "eslint.validate": ["javascript", "typescript"],
  "eslint.useFlatConfig": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "always"
  }
}
2. 安装eslint printer插件
3. 设置保存时自动

```

保存时自动格式化（Cursor / VSCode）
你项目里我已经加好了 .vscode/settings.json，只要你本机装好扩展，就能 保存自动格式化。
需要安装两个扩展
Prettier - Code formatter（发布者：esbenp.prettier-vscode）
ESLint（发布者：dbaeumer.vscode-eslint）
确认工作区设置已生效
打开 D:\Ai-Engineer\langchain-express-boot\.vscode\settings.json
确保有这些关键项（已在项目中配置）：
"editor.formatOnSave": true
"editor.defaultFormatter": "esbenp.prettier-vscode"
如果你还想保存时顺便自动修复 ESLint（可选）
目前配置为 "source.fixAll.eslint": "explicit"（避免每次保存都改太多）
你想“保存就自动修复”的话，我可以把它改成 "always"。你希望开启吗？
