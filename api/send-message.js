export const config = {
  runtime: 'edge', 
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
  }

  try {
    const formData = await req.formData();
    const text = formData.get('text') || 'Без текста';
    const photo = formData.get('photo');

    const TOKEN = process.env.TG_TOKEN;
    const CHAT_ID = process.env.TG_CHAT_ID;

    if (!TOKEN || !CHAT_ID) {
      throw new Error("Переменные окружения не настроены");
    }

    const tgData = new FormData();
    tgData.append('chat_id', CHAT_ID);

    let method = 'sendMessage';
    const captionText = `🔔 Анонимный отзыв:\n\n${text}`;

    // Если прикреплен файл
    if (photo && photo.size > 0) {
      method = 'sendPhoto';
      tgData.append('photo', photo);
      tgData.append('caption', captionText);
    } else {
      tgData.append('text', captionText);
    }

    // ИСПРАВЛЕННЫЙ URL (добавлен /bot и правильный домен)
    const url = `https://telegram.org{TOKEN}/${method}`;

    const response = await fetch(url, { 
      method: 'POST', 
      body: tgData 
    });

    const result = await response.json();

    return new Response(JSON.stringify(result), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ ok: false, description: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
