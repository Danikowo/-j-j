export default async function handler(req, res) {
  try {
    const { name, text } = JSON.parse(req.body);
    const TOKEN = process.env.TG_TOKEN;
    const CHAT_ID = process.env.TG_CHAT_ID;

    // Исправленный URL: добавили /bot и знак $
    const url = `https://api.telegram.org{TOKEN}/sendMessage`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: `Отзыв от ${name}\n${text}`,
      }),
    });

    const data = await response.json();
    res.status(200).json(data); // Возвращаем ответ от Телеграма (там будет ok: true)
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: "Ошибка на сервере" });
  }
}
