export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ ok: false, description: "Method Not Allowed" });
    }

    try {
        const { name, text } = req.body;
        const TOKEN = process.env.TG_TOKEN;
        const CHAT_ID = process.env.TG_CHAT_ID;

        const url = `https://api.telegram.org{TOKEN}/sendMessage`;
        
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: `🔔 Новый отзыв!\n👤 От: ${name}\n📝 Текст: ${text}`,
            }),
        });

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
}
