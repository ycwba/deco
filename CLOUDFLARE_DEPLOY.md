# Cloudflare Pages + D1 部署指南

## 快速开始

### 1. 创建 D1 数据库

```bash
# 创建数据库
npm run d1:create

# 输出示例：
# database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

### 2. 更新 wrangler.toml

将 `wrangler.toml` 中的 `database_id` 替换为上一步生成的 ID：

```toml
[[d1_databases]]
binding = "DB"
database_name = "deco-database"
database_id = "你的-database-id"  # ← 替换这里
```

### 3. 初始化数据库表（本地测试）

```bash
npm run d1:init
```

### 4. 本地开发测试

```bash
# 构建前端
npm run build

# 启动本地开发服务器（包含 D1 绑定）
npm run pages:dev
```

### 5. 部署到 Cloudflare

```bash
# 首次部署前，先初始化生产数据库
npm run d1:migrate

# 部署
npm run pages:deploy
```

## 通过 Cloudflare Dashboard 部署

### 1. 创建 D1 数据库

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Workers & Pages** → **D1**
3. 点击 **Create database**
4. 数据库名称：`deco-database`
5. 创建后，复制 **Database ID**

### 2. 初始化数据库

在 D1 控制台中执行 `migrations/schema.sql` 的内容：

```sql
CREATE TABLE IF NOT EXISTS Decoration (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  x TEXT NOT NULL,
  y TEXT NOT NULL,
  icon TEXT NOT NULL,
  nickname TEXT,
  content TEXT NOT NULL,
  isPrivate INTEGER DEFAULT 0,
  images TEXT,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_createdAt ON Decoration(createdAt);
```

### 3. 部署 Pages

1. 在 **Workers & Pages** 中创建新项目
2. 连接 GitHub 仓库
3. 构建配置：
   - **构建命令**: `npm run build`
   - **输出目录**: `dist`
   - **根目录**: `/`

### 4. 绑定 D1 数据库

1. 进入 Pages 项目设置
2. 选择 **Functions** → **D1 database bindings**
3. 添加绑定：
   - **Variable name**: `DB`
   - **D1 database**: 选择 `deco-database`
4. 保存并重新部署

### 5. 设置环境变量（可选）

如果需要自定义配置：
- `SECRET_KEY`: 加密密钥（默认在代码中）

## 项目结构

```
functions/
  api/
    [[path]].js      # API 路由（直接使用 D1）
  _middleware.js     # CORS 中间件
migrations/
  schema.sql         # D1 数据库表结构
wrangler.toml        # Cloudflare 配置（包含 D1 绑定）
```

## 有用的命令

```bash
# 本地查询 D1 数据库
wrangler d1 execute deco-database --local --command "SELECT * FROM Decoration"

# 生产环境查询
wrangler d1 execute deco-database --command "SELECT * FROM Decoration"

# 查看部署日志
wrangler pages deployment list

# 实时查看日志
wrangler pages deployment tail
```

## 注意事项

✅ **优势：**
- 完全免费（D1 免费额度：5GB 存储 + 每天 500 万次读取）
- 原生集成，无需外部数据库
- 全球边缘节点，低延迟
- SQLite 兼容

⚠️ **限制：**
- D1 还在 Beta 阶段
- 图片上传需要集成 R2（对象存储）
- 单个数据库最大 500MB（免费版）

## 添加图片存储（可选）

使用 Cloudflare R2 存储用户上传的图片：

```bash
# 创建 R2 bucket
wrangler r2 bucket create deco-images

# 在 wrangler.toml 添加绑定
[[r2_buckets]]
binding = "IMAGES"
bucket_name = "deco-images"
```

## 资源链接

- [Cloudflare D1 文档](https://developers.cloudflare.com/d1/)
- [Cloudflare Pages Functions](https://developers.cloudflare.com/pages/functions/)
- [Cloudflare R2 文档](https://developers.cloudflare.com/r2/)
