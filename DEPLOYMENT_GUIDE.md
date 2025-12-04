# DestinyStar Vercel 部署指南

## 📋 概述

本指南将帮助你将 DestinyStar 项目部署到 Vercel，使用免费版即可满足个人项目需求。

## ✅ 部署前准备

### 1. 账号准备

- ✅ [Vercel 账号](https://vercel.com/signup)（免费注册）
- ✅ [GitHub 账号](https://github.com/signup)（用于代码托管）
- ✅ 数据库账号（二选一）：
  - [Vercel Postgres](https://vercel.com/storage/postgres)（推荐，与 Vercel 无缝集成）
  - [Supabase](https://supabase.com/)（免费额度更大）

### 2. 免费额度说明

**Vercel 免费版**:
- ✅ 100GB 带宽/月
- ✅ 无限请求（Serverless Functions）
- ✅ 自动 HTTPS
- ✅ 全球 CDN
- ✅ 自动 CI/CD

**Vercel Postgres 免费版**:
- ✅ 256MB 存储
- ✅ 60 小时计算时间/月
- ✅ 适合个人项目

**Supabase 免费版**:
- ✅ 500MB 数据库存储
- ✅ 2GB 带宽/月
- ✅ 适合需要更多存储的项目

## 🚀 部署步骤

### 步骤 1: 准备代码仓库

```bash
# 1. 初始化 Git 仓库（如果还没有）
git init

# 2. 创建 .gitignore（如果还没有）
# 确保包含 node_modules, .env, .next 等

# 3. 提交代码
git add .
git commit -m "Initial commit"

# 4. 在 GitHub 创建新仓库，然后推送
git remote add origin https://github.com/yourusername/destinystar.git
git branch -M main
git push -u origin main
```

### 步骤 2: 创建 Vercel 项目

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 **"Add New..."** → **"Project"**
3. 导入你的 GitHub 仓库
4. 选择仓库 `destinystar`
5. 点击 **"Import"**

### 步骤 3: 配置项目设置

在 Vercel 项目配置页面：

**Framework Preset**: Next.js（自动检测）  
**Root Directory**: `./`（默认）  
**Build Command**: `next build`（默认）  
**Output Directory**: `.next`（默认）  
**Install Command**: `pnpm install`（根据你的包管理器选择）

### 步骤 4: 设置数据库

#### 选项 A: Vercel Postgres（推荐）

1. 在 Vercel 项目页面，点击 **"Storage"** 标签
2. 点击 **"Create Database"**
3. 选择 **"Postgres"**
4. 选择 **"Hobby"** 计划（免费版）
5. 创建数据库
6. 复制数据库连接字符串

#### 选项 B: Supabase

1. 登录 [Supabase Dashboard](https://app.supabase.com/)
2. 创建新项目
3. 在项目设置中找到数据库连接字符串
4. 复制连接字符串

### 步骤 5: 配置环境变量

在 Vercel 项目页面：

1. 进入 **"Settings"** → **"Environment Variables"**
2. 添加以下环境变量：

#### 必需的环境变量

```bash
# 数据库连接（Vercel Postgres）
DATABASE_URL="postgresql://..."

# 或者（Supabase）
# DATABASE_URL="postgresql://postgres:[password]@[host]:5432/postgres"

# NextAuth.js 配置
NEXTAUTH_URL="https://your-project.vercel.app"
NEXTAUTH_SECRET="your-secret-key-here"

# 生成 NEXTAUTH_SECRET（在本地运行）
# openssl rand -base64 32
```

#### 可选的环境变量

```bash
# 如果使用邮箱认证
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"

# 如果使用其他服务
# ...
```

### 步骤 6: 部署

1. 点击 **"Deploy"** 按钮
2. Vercel 会自动：
   - 安装依赖
   - 运行构建命令
   - 部署到全球 CDN
3. 等待部署完成（通常 1-3 分钟）

### 步骤 7: 运行数据库迁移

部署完成后，需要运行数据库迁移：

**方法一：通过 Vercel CLI（推荐）**

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 链接项目
vercel link

# 运行迁移
vercel env pull .env.local
npx prisma migrate deploy
```

**方法二：通过 Vercel Dashboard**

1. 在项目设置中添加构建命令：
   ```
   pnpm prisma generate && pnpm prisma migrate deploy && pnpm build
   ```
2. 重新部署项目

## 🔧 本地开发配置

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置环境变量

创建 `.env.local` 文件：

```bash
# 从 Vercel Dashboard 复制环境变量
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
```

### 3. 运行数据库迁移

```bash
# 生成 Prisma Client
npx prisma generate

# 运行迁移
npx prisma migrate dev
```

### 4. 启动开发服务器

```bash
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000)

## 📝 持续部署（CI/CD）

Vercel 自动配置了 CI/CD：

- ✅ 每次推送到 `main` 分支自动部署
- ✅ Pull Request 自动创建预览部署
- ✅ 自动运行构建和测试

### 工作流程

1. 本地开发 → `git push` → GitHub
2. GitHub → 自动触发 → Vercel 部署
3. 部署完成 → 自动更新生产环境

## 🔍 常见问题

### Q1: 数据库连接失败？

**解决方案**:
- 检查 `DATABASE_URL` 环境变量是否正确
- 确认数据库是否已创建并运行
- 检查 IP 白名单设置（某些数据库服务需要）

### Q2: 构建失败？

**解决方案**:
- 检查构建日志中的错误信息
- 确认所有环境变量已设置
- 检查 `package.json` 中的脚本是否正确

### Q3: 如何查看日志？

**解决方案**:
- Vercel Dashboard → 项目 → "Deployments" → 选择部署 → "Functions" 标签
- 或使用 Vercel CLI: `vercel logs`

### Q4: 如何回滚到之前的版本？

**解决方案**:
- Vercel Dashboard → "Deployments" → 选择之前的部署 → "..." → "Promote to Production"

### Q5: 免费版限制？

**解决方案**:
- Vercel 免费版对个人项目完全够用
- 如果超出限制，考虑升级到 Pro ($20/月)
- 或优化代码减少资源使用

## 🎯 部署后检查清单

- [ ] 网站可以正常访问
- [ ] 数据库连接正常
- [ ] 用户注册/登录功能正常
- [ ] API 路由正常工作
- [ ] 环境变量已正确配置
- [ ] 数据库迁移已运行
- [ ] 自定义域名已配置（如需要）
- [ ] HTTPS 证书已自动配置

## 🔐 安全建议

1. **环境变量安全**:
   - ✅ 不要在代码中硬编码敏感信息
   - ✅ 使用 Vercel 环境变量管理
   - ✅ 不要提交 `.env` 文件到 Git

2. **数据库安全**:
   - ✅ 使用强密码
   - ✅ 启用 SSL 连接
   - ✅ 定期备份数据

3. **API 安全**:
   - ✅ 实施 Rate Limiting
   - ✅ 验证用户输入
   - ✅ 使用 HTTPS

## 📊 监控和分析

### Vercel Analytics（免费版）

1. 在项目设置中启用 Analytics
2. 查看访问统计、性能指标
3. 监控错误和异常

### 自定义监控

- 使用 Sentry 进行错误追踪（可选）
- 使用 Google Analytics（可选）

## 🎉 完成！

部署完成后，你的网站将在以下地址可用：

- **生产环境**: `https://your-project.vercel.app`
- **预览环境**: 每次 PR 自动生成预览链接

---

**需要帮助？** 查看 [Vercel 文档](https://vercel.com/docs) 或 [Next.js 部署文档](https://nextjs.org/docs/deployment)

**最后更新**: 2024年

