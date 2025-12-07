// api/index.js - Vercel Serverless Function
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const CryptoJS = require('crypto-js');
const multer = require('multer');

const app = express();
const prisma = new PrismaClient();

// 配置
const SECRET_KEY = process.env.SECRET_KEY || "my-secret-key-123";
const CHRISTMAS_DATE = new Date('2025-12-25T00:00:00');

// 中间件
app.use(cors());
app.use(express.json());

// Vercel 环境下使用内存存储
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

// 工具函数
const encrypt = (text) => {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
};

const decrypt = (ciphertext) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// API 路由
app.post('/api/decorations', upload.array('images', 3), async (req, res) => {
  try {
    const { x, y, icon, nickname, content, isPrivate } = req.body;
    const files = req.files || [];

    if (!content) return res.status(400).json({ error: "内容不能为空" });

    // Vercel 环境下，图片需要上传到外部存储（如 Cloudinary, Vercel Blob 等）
    // 这里暂时不保存图片，或者你可以集成 Vercel Blob
    const imagePaths = [];

    const encryptedContent = encrypt(content);

    const newDecoration = await prisma.decoration.create({
      data: {
        x: String(x),
        y: String(y),
        icon,
        nickname,
        content: encryptedContent,
        isPrivate: Boolean(isPrivate === 'true' || isPrivate === true),
        images: JSON.stringify(imagePaths)
      }
    });

    res.json({ success: true, id: newDecoration.id });
  } catch (error) {
    console.error("Save error:", error);
    res.status(500).json({ error: "服务器出小差了" });
  }
});

app.get('/api/decorations', async (req, res) => {
  try {
    const allDecorations = await prisma.decoration.findMany({
      orderBy: { createdAt: 'asc' }
    });

    const now = new Date();
    const isUnlocked = now >= CHRISTMAS_DATE;

    const safeData = allDecorations.map(item => {
      let images = [];
      try {
        if (item.images) images = JSON.parse(item.images);
      } catch (e) { images = [] }

      const safeItem = {
        id: item.id,
        x: item.x,
        y: item.y,
        icon: item.icon,
        nickname: item.nickname,
        isPrivate: item.isPrivate,
        createdAt: item.createdAt,
        images: images
      };

      if (isUnlocked) {
        try {
          safeItem.content = decrypt(item.content);
        } catch (e) {
          safeItem.content = "[解密失败]";
        }
      } else {
        safeItem.content = "🔒 封印中..."; 
      }

      return safeItem;
    });

    res.json({ 
      isUnlocked,
      data: safeData 
    });

  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: "获取失败" });
  }
});

// Vercel 需要导出 app
module.exports = app;
