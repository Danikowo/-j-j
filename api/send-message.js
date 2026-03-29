export default async function handler(req, res) {
  try {
    // Vercel иногда присылает данные уже как объект, а иногда как строку
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { name, text } = body;

    const TOKEN = process.env.TG_TOKEN;
    const CHAT_ID = process.env.TG_CHAT_ID;

    // Ссылка на отправку (проверь, чтобы были ` эти кавычки)
    const url = `https://api.telegram.org{TOKEN}/sendMessage`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: `🔔 Отзыв от: ${name}\n📝 Текст: ${text}`,
      }),
    });

    const data = await response.json();
    
    if (data.ok) {
        return res.status(200).json({ ok: true });
    } else {
        // Если Телеграм вернул ошибку (например, токен неверный)
        return res.status(400).json({ ok: false, description: data.description });
    }
  } catch (error) {
    return res.status(500).json({ ok: false, description: "Ошибка на сервере Vercel" });
  }
}
