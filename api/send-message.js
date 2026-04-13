export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  try {
    const formData = await req.formData();
    const text = formData.get('text') || 'Без текста';
    const photo = formData.get('photo');

    // ВАЖНО: В режиме Edge переменные берутся напрямую из process.env
    const TOKEN = process.env.TG_TOKEN;
    const CHAT_ID = process.env.TG_CHAT_ID;

    if (!TOKEN || !CHAT_ID) {
      return new Response(JSON.stringify({ ok: false, description: "Токен или ID не найдены в настройках Vercel" }), { status: 500 });
    }

    const tgData = new FormData();
    tgData.append('chat_id', CHAT_ID);

    let method = 'sendMessage';

    if (photo && photo.size > 0) {
      method = 'sendPhoto';
      tgData.append('photo', photo);
      tgData.append('caption', `🔔 Анонимный отзыв:\n\n${text}`);
    } else {
      method = 'sendMessage';
      tgData.append('text', `🔔 Анонимный отзыв:\n\n${text}`);
    }

    // ИСПРАВЛЕННЫЙ URL (без фигурных скобок, просто склейка)
    const url = "https://telegram.org" + TOKEN + "/" + method;

    const response = await fetch(url, {
      method: 'POST',
      body: tgData,
    });

    const result = await response.json();
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ ok: false, description: error.message }), {
      status: 500,
    });
  }
}
