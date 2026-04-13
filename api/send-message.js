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
    if (err) return res.status(500).json({ ok: false, description: "Ошибка файлов" });

    // --- ВСТАВЬ СВОИ ДАННЫЕ СЮДА ---
    const TOKEN = "8795571337:AAESgBTvz4S1hg8iagCb77qLMX05vOkwuBQ"; // Твой токен
    const CHAT_ID = "5502948313"; // Твой ID (или ID группы с минусом)
    // ------------------------------

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
      // Прямая ссылка без лишних символов
      const url = `https://telegram.org{TOKEN}/${method}`;
      
      const response = await fetch(url, {
        method: 'POST',
        body: tgFormData,
        headers: tgFormData.getHeaders(),
      });

      const result = await response.json();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ ok: false, description: "Ошибка отправки: " + error.message });
    }
  });
}
