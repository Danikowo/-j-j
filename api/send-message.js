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
      return new Response(JSON.stringify({ ok: false, description: "Настройки Vercel пустые (TG_TOKEN/CHAT_ID)" }), { status: 500 });
    }

    const captionText = `🔔 Анонимный отзыв:\n\n${text}`;
    
    // Подготавливаем данные для Telegram
    const tgFormData = new FormData();
    tgFormData.append('chat_id', CHAT_ID);

    let method = 'sendMessage';

    // Проверяем наличие фото (объект должен иметь размер)
    if (photo && typeof photo === 'object' && photo.size > 0) {
      method = 'sendPhoto';
      tgFormData.append('photo', photo); // Передаем сам объект файла
      tgFormData.append('caption', captionText);
    } else {
      tgFormData.append('text', captionText);
    }

    const url = `https://telegram.org/bot${TOKEN}`;

    // Отправляем запрос
    const response = await fetch(url, {
      method: 'POST',
      body: tgFormData,
      // Заголовки Content-Type ставить НЕЛЬЗЯ, fetch сам создаст boundary
    });

    const result = await response.json();

    return new Response(JSON.stringify(result), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      ok: false, 
      description: "Ошибка сервера: " + error.message 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
