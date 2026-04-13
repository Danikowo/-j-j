export const config = {
  runtime: 'edge', // Это сделает сервер быстрым и надежным
};

export default async function handler(req) {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  try {
    const formData = await req.formData();
    const text = formData.get('text') || 'Без текста';
    const photo = formData.get('photo');

    const TOKEN = process.env.TG_TOKEN;
    const CHAT_ID = process.env.TG_CHAT_ID;

    const tgData = new FormData();
    tgData.append('chat_id', CHAT_ID);

    let method = 'sendMessage';

    // Если фото есть и оно не пустое
    if (photo && photo.size > 0) {
      method = 'sendPhoto';
      tgData.append('photo', photo);
      tgData.append('caption', `🔔 Анонимный отзыв:\n\n${text}`);
    } else {
      tgData.append('text', `🔔 Анонимный отзыв:\n\n${text}`);
    }

    const url = `https://telegram.org{TOKEN}/${method}`;
    const response = await fetch(url, { method: 'POST', body: tgData });
    const result = await response.json();

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ ok: false, description: error.message }), { status: 500 });
  }
}
