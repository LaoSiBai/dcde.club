# Node.js 24 升级 + TailwindCSS v4 安装计划

## TL;DR

> **快速摘要**: 将 Node.js 从 v22 升级到 v24 LTS，安装 TailwindCSS v4 到 Next.js 16 项目

> **交付物**:
> - Node.js 24.x LTS 环境
> - TailwindCSS v4 完整配置

> **预计工作量**: Short
> **执行方式**: 顺序执行 (依赖步骤)

---

## Context

### 原始请求
用户希望:
1. 升级到最新的 Node.js 长期支持版
2. 升级到 Next.js 长期支持版
3. 更好运行 TailwindCSS

### 现状分析
| 项目 | 当前版本 | 目标版本 |
|------|----------|----------|
| Node.js | 22.17.1 (Maintenance LTS) | 24.x (Active LTS) |
| Next.js | 16.1.6 (最新) | 保持不变 (已是最新) |
| TailwindCSS | 未安装 | v4 |

### 研究发现
- **Node.js 24.x** (代号 Krypton): 2025年10月进入 Active LTS，版本范围 24.0.0 - 24.14.x
- **Next.js 16.x**: 已是最新稳定版，无需降级
- **TailwindCSS v4**: 2025年1月发布，使用新 Oxide 引擎 (Rust)，与 Next.js 16 + Turbopack 完美兼容

---

## Work Objectives

### 核心目标
- 升级 Node.js 到 v24.x LTS
- 在 Next.js 16 项目中安装并配置 TailwindCSS v4

### 交付物
- [ ] Node.js 24.x 环境
- [ ] `postcss.config.mjs` 配置文件
- [ ] 更新后的 `src/app/globals.css`
- [ ] 可用的 TailwindCSS 工具类

### 验证命令
```bash
node --version    # 预期输出: v24.x.x
npm run dev      # 预期输出: 开发服务器正常启动
```

---

## Execution Strategy

### 执行顺序

```
步骤 1: 升级 Node.js 到 24.x
    │
    ▼
步骤 2: 安装 TailwindCSS v4 依赖
    │
    ▼
步骤 3: 配置 PostCSS
    │
    ▼
步骤 4: 更新 CSS 导入
    │
    ▼
步骤 5: 验证构建
```

---

## TODOs

- [ ] 1. 升级 Node.js 到 24.x LTS

  **What to do**:
  - 检查用户是否使用 nvm 管理 Node 版本
  - 如果使用 nvm: `nvm install 24 && nvm use 24`
  - 如果直接安装: 下载 Node.js 24.x 安装包
  - 验证: `node --version` 应显示 v24.x

  **References**:
  - Node.js 官方发布页: https://nodejs.org/en/about/releases/

  **Acceptance Criteria**:
  - [ ] node --version 输出 v24.x.x

  **QA Scenarios**:
  ```
  Scenario: Node.js 版本验证
    Tool: Bash
    Preconditions: 无
    Steps:
      1. 运行 node --version
      2. 验证输出以 v24 开头
    Expected Result: v24.x.x
    Evidence: 终端输出
  ```

  **Commit**: YES
  - Message: `chore: upgrade Node.js to v24 LTS`
  - Files: `.nvmrc` (如需要)

---

- [ ] 2. 安装 TailwindCSS v4 依赖

  **What to do**:
  - 运行 `npm install tailwindcss @tailwindcss/postcss postcss`
  - 这将更新 package.json 和 package-lock.json

  **Acceptance Criteria**:
  - [ ] package.json 包含 tailwindcss, @tailwindcss/postcss, postcss

  **QA Scenarios**:
  ```
  Scenario: 依赖安装验证
    Tool: Bash
    Preconditions: 无
    Steps:
      1. 运行 npm list tailwindcss
    Expected Result: 显示 tailwindcss 版本
    Evidence: npm 输出
  ```

  **Commit**: YES
  - Message: `feat: install TailwindCSS v4 dependencies`
  - Files: `package.json`, `package-lock.json`

---

- [ ] 3. 配置 PostCSS

  **What to do**:
  - 创建 `postcss.config.mjs` 文件
  - 添加 `@tailwindcss/postcss` 插件配置

  **References**:
  - 官方文档: https://tailwindcss.com/docs/installation/framework-guides/nextjs

  **Acceptance Criteria**:
  - [ ] postcss.config.mjs 存在并包含正确配置

  **QA Scenarios**:
  ```
  Scenario: PostCSS 配置验证
    Tool: Bash
    Preconditions: 无
    Steps:
      1. 读取 postcss.config.mjs
      2. 验证包含 @tailwindcss/postcss
    Expected Result: 文件包含正确配置
    Evidence: 文件内容
  ```

  **Commit**: YES
  - Message: `feat: add PostCSS config for TailwindCSS v4`
  - Files: `postcss.config.mjs`

---

- [ ] 4. 更新 globals.css 导入 TailwindCSS

  **What to do**:
  - 读取当前 `src/app/globals.css`
  - 替换为 `@import "tailwindcss";`

  **Acceptance Criteria**:
  - [ ] globals.css 包含 `@import "tailwindcss";`

  **QA Scenarios**:
  ```
  Scenario: CSS 配置验证
    Tool: Bash
    Preconditions: 无
    Steps:
      1. 读取 src/app/globals.css
      2. 验证包含 @import "tailwindcss"
    Expected Result: 文件包含正确导入
    Evidence: 文件内容
  ```

  **Commit**: YES
  - Message: `feat: configure TailwindCSS import in globals.css`
  - Files: `src/app/globals.css`

---

- [ ] 5. 验证构建

  **What to do**:
  - 运行 `npm run build` 验证项目构建
  - 确保 TailwindCSS 正确工作

  **Acceptance Criteria**:
  - [ ] npm run build 成功 (无错误)

  **QA Scenarios**:
  ```
  Scenario: 开发服务器启动验证
    Tool: Bash
    Preconditions: 无
    Steps:
      1. 运行 npm run build
      2. 验证无错误输出
    Expected Result: 构建成功
    Evidence: 构建输出
  ```

  **Commit**: YES
  - Message: `chore: verify TailwindCSS integration`
  - Files: 无 (仅验证)

---

## Final Verification Wave

- [ ] F1. **Node.js 版本检查** — 确认 v24.x
  运行 `node --version` 和 `npm --version`

- [ ] F2. **依赖完整性检查** — 确认所有依赖正确
  检查 package.json 包含 tailwindcss, @tailwindcss/postcss

- [ ] F3. **构建验证** — 确认 TailwindCSS 工作
  运行 `npm run build` 成功

---

## Success Criteria

### 验证命令
```bash
node --version    # 预期: v24.x.x
npm run build     # 预期: 成功 (0 errors)
```

### 最终检查
- [ ] Node.js 已升级到 v24.x LTS
- [ ] TailwindCSS v4 已安装并配置
- [ ] 项目构建成功