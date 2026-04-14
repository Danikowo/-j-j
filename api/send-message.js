export const config = { runtime: 'edge' };

export default async function handler(req) {
  // Разрешаем только POST
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ ok: false, description: "Метод не разрешен" }), { status: 405 });
  }

  try {
    const formData = await req.formData();
    const text = formData.get('text') || 'Без текста';
    const photo = formData.get('photo');

    const TOKEN = process.env.TG_TOKEN;
    const CHAT_ID = process.env.TG_CHAT_ID;

    // Проверяем ключи. Если их нет, выводим ошибку как JSON
    if (!TOKEN || !CHAT_ID) {
      return new Response(JSON.stringify({ ok: false, description: "Ключи TG_TOKEN или TG_CHAT_ID не настроены в Vercel" }), { status: 200 });
    }

    const tgData = new FormData();
    tgData.append('chat_id', CHAT_ID);

    let method = 'sendMessage';
    const captionText = `🔔 Анонимное сообщение:\n\n${text}`;

    // Проверяем, пришло ли фото и является ли оно файлом
    if (photo && typeof photo === 'object' && photo.size > 0) {
      method = 'sendPhoto';
      tgData.append('photo', photo);
      tgData.append('caption', captionText);
    } else {
      tgData.append('text', captionText);
    }
    
const url = `https://api.telegram.org/bot${TOKEN}/${method}`;


    const response = await fetch(url, {
      method: 'POST',
      body: tgData
    });

    const result = await response.json();

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    // Вместо 500 возвращаем 200 с описанием ошибки, чтобы ты увидел её в alert
    return new Response(JSON.stringify({ ok: false, description: "Ошибка сервера: " + error.message }), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
