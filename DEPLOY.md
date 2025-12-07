# 部署指南

本项目支持部署到 **Vercel** 和 **Cloudflare Pages**，请根据你的需求选择平台。

---

## 🔷 方案一：部署到 Vercel

### 特点
- ✅ 使用 PostgreSQL 数据库（Vercel Postgres 或其他）
- ✅ 成熟稳定，适合生产环境
- ✅ 自动 CI/CD

### 快速部署

#### 1. 准备数据库
在 Vercel 创建 PostgreSQL 数据库：
- 推荐使用 **Vercel Postgres**（一键集成）
- 或使用 Neon、Supabase 等

#### 2. 设置环境变量
在 Vercel 项目设置中添加：
```bash
DATABASE_URL="postgresql://user:password@host:port/database"
SECRET_KEY="your-secret-key-here"
```

#### 3. 部署
```bash
# 方式 1: 通过 Vercel CLI
npm i -g vercel
vercel login
vercel

# 方式 2: 通过 GitHub
# 直接在 Vercel 导入 GitHub 仓库即可
```

#### 4. 运行数据库迁移
```bash
# 连接到生产数据库执行迁移
DATABASE_URL="your-production-url" npx prisma db push
```

### 配置文件
- `api/decorations.js` - Vercel Serverless Function
- `vercel.json` - Vercel 配置
- `server/prisma/schema.prisma` - PostgreSQL 配置

---

## 🟠 方案二：部署到 Cloudflare Pages

### 特点
- ✅ 使用 D1 数据库（原生 SQLite）
- ✅ 完全免费（5GB 存储 + 每天 500 万次读取）
- ✅ 全球边缘网络，超低延迟
- ⚠️ D1 还在 Beta 阶段

### 快速部署

#### 1. 创建 D1 数据库
```bash
npm run d1:create
```
复制输出的 `database_id`

#### 2. 更新 wrangler.toml
将 `database_id` 替换为你的实际 ID：
```toml
[[d1_databases]]
binding = "DB"
database_name = "deco-database"
database_id = "你的-database-id"  # ← 替换这里
```

#### 3. 初始化数据库
```bash
# 本地测试
npm run d1:init

# 生产环境
npm run d1:migrate
```

#### 4. 部署
```bash
# 方式 1: 通过 Wrangler CLI
npm run pages:deploy

# 方式 2: 通过 GitHub
# 在 Cloudflare Pages 导入仓库，然后在设置中绑定 D1
```

#### 5. 绑定 D1（如果通过 Dashboard 部署）
1. 进入 Pages 项目设置
2. Functions → D1 database bindings
3. 添加：变量名 `DB`，选择 `deco-database`

### 配置文件
- `functions/api/[[path]].js` - Cloudflare Pages Function
- `wrangler.toml` - Cloudflare 配置
- `migrations/schema.sql` - D1 表结构

---

## 📊 平台对比

| 特性 | Vercel | Cloudflare Pages |
|------|--------|------------------|
| 数据库 | PostgreSQL | D1 (SQLite) |
| 免费额度 | 有限 | 慷慨 |
| 冷启动 | 快 | 极快 |
| 成熟度 | 稳定 | Beta |
| 图片存储 | ❌ 需要外部服务 | ❌ 需要 R2 |

---

## 🔧 本地开发

### Vercel 模式
```bash
npm run dev          # 前端开发
npm run build        # 构建
```

### Cloudflare 模式
```bash
npm run build        # 构建前端
npm run pages:dev    # 测试 Pages Functions + D1
```

---

## ⚠️ 注意事项

### 图片上传功能
当前两个平台都**不支持图片上传**（无状态函数）。如需支持：
- **Vercel**: 集成 Vercel Blob 或 Cloudinary
- **Cloudflare**: 集成 R2 对象存储

### 切换平台
- 部署到 **Vercel**: 使用 `api/decorations.js` + PostgreSQL
- 部署到 **Cloudflare**: 使用 `functions/api/[[path]].js` + D1
- 两者互不干扰，可以同时存在

---

## 📚 详细文档

- [Vercel 完整指南](./VERCEL_DEPLOY.md)
- [Cloudflare 完整指南](./CLOUDFLARE_DEPLOY.md)

---

## 🆘 常见问题

**Q: 如何选择平台？**
A: 
- 需要稳定生产环境 → Vercel
- 想要免费且高性能 → Cloudflare
- 可以两个都部署，分别测试

**Q: 数据库可以共用吗？**
A: 不建议。两个平台使用不同的数据库（PostgreSQL vs SQLite）

**Q: 可以同时部署吗？**
A: 可以！两套配置互不影响
