# Vercel 部署指南

## 准备工作

### 1. 创建 PostgreSQL 数据库
Vercel 不支持 SQLite，需要使用 PostgreSQL。推荐使用：
- **Vercel Postgres**（推荐）
- Supabase
- Neon
- Railway

### 2. 在 Vercel 设置环境变量
在 Vercel 项目设置中添加以下环境变量：

```bash
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"
SECRET_KEY="your-secret-key-here"
```

## 部署步骤

### 方式一：通过 Vercel CLI

1. 安装 Vercel CLI：
```bash
npm i -g vercel
```

2. 登录 Vercel：
```bash
vercel login
```

3. 部署：
```bash
vercel
```

### 方式二：通过 GitHub

1. 将代码推送到 GitHub
2. 在 Vercel 导入 GitHub 仓库
3. 配置环境变量
4. 点击部署

## 数据库迁移

部署后，需要运行数据库迁移：

```bash
# 在本地连接到生产数据库
DATABASE_URL="your-production-database-url" npx prisma db push

# 或者使用迁移
DATABASE_URL="your-production-database-url" npx prisma migrate deploy
```

## 注意事项

⚠️ **重要变更：**

1. **数据库**：从 SQLite 改为 PostgreSQL
2. **图片上传**：当前配置暂不支持图片上传（Vercel 无状态）
   - 建议集成 Vercel Blob 或 Cloudinary
3. **Base URL**：已改为根路径 `/`

## 图片存储解决方案（可选）

如需支持图片上传，可以集成 Vercel Blob：

```bash
npm install @vercel/blob
```

参考文档：https://vercel.com/docs/storage/vercel-blob
