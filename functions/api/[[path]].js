import CryptoJS from 'crypto-js';

const SECRET_KEY = "my-secret-key-123";
const CHRISTMAS_DATE = new Date('2025-12-25T00:00:00');

const encrypt = (text) => {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
};

const decrypt = (ciphertext) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export async function onRequest(context) {
  const { request, env } = context;
  const db = env.DB; // D1 数据库绑定
  const url = new URL(request.url);

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (request.method === 'POST' && url.pathname === '/api/decorations') {
      const formData = await request.formData();
      const x = formData.get('x');
      const y = formData.get('y');
      const icon = formData.get('icon');
      const nickname = formData.get('nickname');
      const content = formData.get('content');
      const isPrivate = formData.get('isPrivate');

      if (!content) {
        return new Response(JSON.stringify({ error: "内容不能为空" }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const encryptedContent = encrypt(content);

      const result = await db.prepare(
        `INSERT INTO Decoration (x, y, icon, nickname, content, isPrivate, images, createdAt) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        String(x),
        String(y),
        icon,
        nickname,
        encryptedContent,
        isPrivate === 'true' || isPrivate === true ? 1 : 0,
        JSON.stringify([]),
        new Date().toISOString()
      ).run();

      return new Response(JSON.stringify({ success: true, id: result.meta.last_row_id }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (request.method === 'GET' && url.pathname === '/api/decorations') {
      const result = await db.prepare(
        `SELECT * FROM Decoration ORDER BY createdAt ASC`
      ).all();

      const now = new Date();
      const isUnlocked = now >= CHRISTMAS_DATE;

      const safeData = result.results.map(item => {
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
          isPrivate: Boolean(item.isPrivate),
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

      return new Response(JSON.stringify({ isUnlocked, data: safeData }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response('Not Found', { status: 404, headers: corsHeaders });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}
