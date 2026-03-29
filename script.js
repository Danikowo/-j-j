export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  try {
    // Читаем данные. Если Vercel прислал строку, превращаем в объект
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { name, text } = body;

    const TOKEN = process.env.TG_TOKEN;
    const CHAT_ID = process.env.TG_CHAT_ID;

    // Прямой запрос к API Telegram
    const response = await fetch(`https://api.telegram.org{TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: `👤 От: ${name}\n📝 Текст: ${text}`
      })
    });

    const result = await response.json();
    return res.status(200).json(result);
  } catch (err) {
    // Если fetch failed, мы увидим причину в алерте на сайте
    return res.status(500).json({ ok: false, error: err.message });
  }
}
