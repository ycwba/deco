// server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const CryptoJS = require('crypto-js');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const prisma = new PrismaClient();
const PORT = 3000; // 后端运行在 3000 端口

// --- 配置区 ---
// 从环境变量获取密钥，如果没有则使用默认值 (仅用于开发，生产环境必须在 .env 设置!)
const SECRET_KEY = process.env.SECRET_KEY || "my-secret-key-123";
const CHRISTMAS_DATE = new Date('2025-12-25T00:00:00'); // 设置你的目标解锁时间
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
// --- 中间件 ---
app.use(cors()); // 允许前端访问
app.use(express.json()); // 解析 JSON 请求体

// 让前端可以通过 http://localhost:3000/uploads/xxx.jpg 访问图片
app.use('/uploads', express.static(uploadDir));

// --- 1. 配置 Multer (文件存储策略) ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // 存在 server/uploads 目录下
  },
  filename: function (req, file, cb) {
    // 生成唯一文件名: timestamp-random.jpg
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 限制一张图最大 5MB
});

// --- 工具函数：加密与解密 ---
const encrypt = (text) => {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
};

const decrypt = (ciphertext) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// --- API 路由 ---

// 1. 提交留言 (POST)
app.post('/api/decorations', upload.array('images', 3), async (req, res) => {
  try {
    // Multer 会把文件放在 req.files，把文本字段放在 req.body
    const { x, y, icon, nickname, content, isPrivate } = req.body;
    const files = req.files || [];

    if (!content) return res.status(400).json({ error: "内容不能为空" });

    // 处理图片路径
    const imagePaths = files.map(f => '/uploads/' + f.filename);

    const encryptedContent = encrypt(content);

    const newDecoration = await prisma.decoration.create({
      data: {
        x: String(x),
        y: String(y),
        icon,
        nickname,
        content: encryptedContent,
        isPrivate: Boolean(isPrivate === 'true' || isPrivate === true), // FormData 传过来的可能是字符串 'true'
        images: JSON.stringify(imagePaths) // 存为 JSON 字符串
      }
    });

    res.json({ success: true, id: newDecoration.id });
  } catch (error) {
    console.error("Save error:", error);
    res.status(500).json({ error: "服务器出小差了" });
  }
});

// 2. 获取所有留言 (GET)
app.get('/api/decorations', async (req, res) => {
  try {
    const allDecorations = await prisma.decoration.findMany({
      orderBy: { createdAt: 'asc' }
    });

    const now = new Date();
    const isUnlocked = now >= CHRISTMAS_DATE;

    // 处理数据返回逻辑
    const safeData = allDecorations.map(item => {
      let images = [];
      try {
        if (item.images) images = JSON.parse(item.images);
      } catch (e) { images = [] }

      const safeItem = {
        // ... (其他字段不变)
        id: item.id,
        x: item.x,
        y: item.y,
        icon: item.icon,
        nickname: item.nickname,
        isPrivate: item.isPrivate,
        createdAt: item.createdAt,
        images: images // 返回图片数组
      };


      // --- 时间锁逻辑 ---
      if (isUnlocked) {
        // 时间到了：解密内容并返回
        // 如果是私密消息，这里依然可以根据业务需求决定是否返回
        // 简单起见：如果是私密且没鉴权，前端虽然拿到了，但 UI 上可以根据 isPrivate 隐藏
        try {
          safeItem.content = decrypt(item.content);
        } catch (e) {
          safeItem.content = "[解密失败]";
        }
      } else {
        // 时间没到：绝不返回 content 字段，或者返回假文案
        safeItem.content = "🔒 封印中..."; 
      }

      return safeItem;
    });

    res.json({ 
      isUnlocked, // 告诉前端现在的状态
      data: safeData 
    });

  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: "获取失败" });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🎄 Backend running at http://localhost:${PORT}`);
  console.log(`🔒 Time Lock set to: ${CHRISTMAS_DATE.toLocaleString()}`);
});