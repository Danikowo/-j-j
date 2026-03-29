export default async function handler(req, res) {
  const { name, text } = JSON.parse(req.body);
  const TOKEN = process.env.TG_TOKEN; // Секрет возьмется из настроек
  const CHAT_ID = process.env.TG_CHAT_ID;

  const url = `https://api.telegram.org{TOKEN}/sendMessage`;
  
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: `Отзыв от ${name}\n${text}`,
    }),
  });

  res.status(200).json({ ok: true });
}
