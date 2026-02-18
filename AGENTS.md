# Repository Guidelines

本仓库是基于 Vue 3 + Vite + TypeScript 的单页主页项目，使用 `pnpm` 管理依赖。请保持改动小而清晰，并在提交与 PR 中说明影响范围。

## 项目结构与模块组织
- `src/` 为源码入口，`src/main.ts` 与 `src/App.vue` 负责启动与根组件。
- `src/components/` 存放可复用组件（PascalCase `.vue`），`src/views/` 以功能分区（如 `Main/Left.vue`）。
- 状态与业务逻辑在 `src/store/`、`src/api/`、`src/utils/`，样式与资源在 `src/style/`、`src/assets/`。
- 静态资源位于 `public/`，构建产物输出到 `dist/`（勿手改）。

## 构建、测试与开发命令
- 环境要求：`node` >= 22.17.0，`npm` >= 10.9.2。
- `npm install -g pnpm`: 首次安装 `pnpm`。
- `pnpm install`: 安装依赖。
- `pnpm dev`: 启动本地开发服务器（含 `--host`）。
- `pnpm build`: 先 `vue-tsc --noEmit` 再构建生产包。
- `pnpm preview`: 预览 `dist/` 构建产物。
- `pnpm lint`: 运行 ESLint 并自动修复。
- `pnpm format`: 对 `src/` 进行 Prettier 格式化。
- `pnpm type-check`: 仅执行类型检查。

## 代码风格与命名约定
- Prettier 规则：2 空格缩进、分号、双引号、尾逗号、`printWidth=100`。
- ESLint 启用 Vue 3 基础规则；组件命名使用 PascalCase，文件名保持与现有结构一致。
- 逻辑优先放在 `*.ts`，单文件组件保持单一职责。

## 测试指南
- 当前未配置独立测试脚本；以 `pnpm type-check` 与 `pnpm lint` 作为质量门槛。
- 若新增测试，请补充对应脚本与目录约定，并在 PR 说明运行方式。

## 提交与 PR 指南
- 历史提交同时存在 Conventional Commits 与描述性提交，建议优先使用 `feat:`、`fix:`、`build(deps):` 等格式。
- 依赖变更请同步更新 `pnpm-lock.yaml`。
- PR 需包含简要说明、关联 Issue（如有）、以及 `.env`/配置变更提示。
- 涉及 UI 变更请附前后对比截图（参考 `screenshots/`）。

## 配置与资源
- 使用 `.env.example` 生成 `.env` 并配置天气/音乐等 API Key；请勿提交真实密钥。
- 站点与社交链接分别在 `src/assets/siteLinks.json`、`src/assets/socialLinks.json`。
- 背景与图标资源在 `public/images/`。
