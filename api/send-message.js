export default async function handler(req, res) {
  // 1. Разрешаем только POST запросы
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, description: "Используйте POST" });
  }

  try {
    // 2. Умное чтение данных (строка или объект)
    let body = req.body;
    if (typeof body === 'string') {
        body = JSON.parse(body);
    }
    
    const { name, text } = body;
    
    // 3. Берем секреты из настроек Vercel
    const TOKEN = process.env.TG_TOKEN?.trim(); // .trim() убирает случайные пробелы
    const CHAT_ID = process.env.TG_CHAT_ID?.trim();

    if (!TOKEN || !CHAT_ID) {
        return res.status(500).json({ ok: false, description: "На Vercel не настроены ключи TG_TOKEN или TG_CHAT_ID" });
    }

    // 4. Отправляем в Telegram
    const url = `https://api.telegram.org{TOKEN}/sendMessage`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: `🔔 Новый отзыв!\n👤 От: ${name || 'Аноним'}\n📝 Текст: ${text || 'Пусто'}`,
      }),
    });

    const data = await response.json();
    
    // 5. Возвращаем результат
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ ok: false, description: "Ошибка кода: " + error.message });
  }
}
