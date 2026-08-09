# 项目长期记忆

## 项目架构

- onepiece 是一个 pnpm monorepo，根目录有 Vue 前端相关配置
- `apps/all-blue` 是 NestJS 后端子项目
- 根 `tsconfig.json` 为 Vue 前端设计（noEmit、esnext、bundler），子项目继承时需按需覆盖

## 技术约定

- 包管理器：pnpm（通过 preinstall 强制 only-allow pnpm）
- Node 版本：22.23.2
- 根 package.json 有 `"type": "module"`
