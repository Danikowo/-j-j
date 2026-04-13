import { Formidable } from 'formidable';
import fs from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch';

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false });

  const form = new Formidable();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ ok: false, description: "Ошибка парсинга формы" });
    }

    // Извлекаем токен и ID
    const TOKEN = process.env.TG_TOKEN;
    const CHAT_ID = process.env.TG_CHAT_ID;

    if (!TOKEN || !CHAT_ID) {
      return res.status(500).json({ ok: false, description: "Переменные не настроены в Vercel" });
    }

    // Обработка данных (поддержка массивов formidable v3)
    const text = Array.isArray(fields.text) ? fields.text[0] : fields.text;
    const photo = Array.isArray(files.photo) ? files.photo[0] : files.photo;

    const tgFormData = new FormData();
    tgFormData.append('chat_id', CHAT_ID);

    let method = 'sendMessage';

    if (photo && photo.filepath && photo.size > 0) {
      method = 'sendPhoto';
      tgFormData.append('photo', fs.createReadStream(photo.filepath));
      tgFormData.append('caption', `🔔 Анонимный отзыв:\n\n${text || 'Без текста'}`);
    } else {
      tgFormData.append('text', `🔔 Анонимный отзыв:\n\n${text || 'Без текста'}`);
    }

    try {
      const url = `https://telegram.org{TOKEN}/${method}`;
      const response = await fetch(url, {
        method: 'POST',
        body: tgFormData,
        headers: tgFormData.getHeaders(),
      });

      const result = await response.json();
      res.status(200).json(result);
    } catch (error) {
      // Это вернет конкретную ошибку в alert на сайте
      res.status(500).json({ ok: false, description: "Ошибка Telegram API: " + error.message });
    }
  });
}
