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
    try {
      if (err) throw new Error("Ошибка чтения формы");

      // Берем данные из Vercel
      const TOKEN = process.env.TG_TOKEN;
      const CHAT_ID = process.env.TG_CHAT_ID;

      // Извлекаем текст и файл (учитываем странности библиотеки formidable)
      const rawText = Array.isArray(fields.text) ? fields.text[0] : fields.text;
      const text = (rawText && rawText.trim()) ? rawText : "Пустое сообщение";
      
      const photo = Array.isArray(files.photo) ? files.photo[0] : files.photo;

      const tgFormData = new FormData();
      tgFormData.append('chat_id', CHAT_ID);

      let method = 'sendMessage';

      if (photo && photo.filepath && photo.size > 0) {
        method = 'sendPhoto';
        tgFormData.append('photo', fs.createReadStream(photo.filepath));
        tgFormData.append('caption', `🔔 Анонимный отзыв:\n\n${text}`);
      } else {
        tgFormData.append('text', `🔔 Анонимный отзыв:\n\n${text}`);
      }

      const url = `https://telegram.org{TOKEN}/${method}`;
      
      const response = await fetch(url, {
        method: 'POST',
        body: tgFormData,
        headers: tgFormData.getHeaders(),
      });

      const result = await response.json();
      return res.status(200).json(result);

    } catch (error) {
      console.error(error);
      // Возвращаем JSON даже при ошибке, чтобы script.js не ругался на "Invalid JSON"
      return res.status(500).json({ ok: false, description: error.message });
    }
  });
}
