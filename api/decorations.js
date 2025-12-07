// Vercel Serverless Function (使用 Prisma + PostgreSQL)
const { PrismaClient } = require('@prisma/client');
const CryptoJS = require('crypto-js');

const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY || "my-secret-key-123";
const CHRISTMAS_DATE = new Date('2025-12-25T00:00:00');

const encrypt = (text) => {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
};

const decrypt = (ciphertext) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'POST' && req.url.includes('/api/decorations')) {
      const { x, y, icon, nickname, content, isPrivate } = req.body;

      if (!content) {
        return res.status(400).json({ error: "内容不能为空" });
      }

      const encryptedContent = encrypt(content);

      const newDecoration = await prisma.decoration.create({
        data: {
          x: String(x),
          y: String(y),
          icon,
          nickname,
          content: encryptedContent,
          isPrivate: Boolean(isPrivate),
          images: JSON.stringify([])
        }
      });

      return res.json({ success: true, id: newDecoration.id });
    }

    if (req.method === 'GET' && req.url.includes('/api/decorations')) {
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

      return res.json({ isUnlocked, data: safeData });
    }

    return res.status(404).json({ error: 'Not Found' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
}

module.exports = handler;
