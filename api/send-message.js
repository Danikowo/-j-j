import { Formidable } from 'formidable';
import fs from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch';

// Отключаем стандартный парсер Vercel, чтобы прочитать файл (Multipart Form Data)
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // Разрешаем только POST запросы
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, description: "Method Not Allowed" });
  }

  const form = new Formidable();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ ok: false, description: "Ошибка при чтении данных" });
    }

    // Извлекаем текст и фото (учитываем, что formidable может вернуть массив)
    const text = Array.isArray(fields.text) ? fields.text[0] : fields.text;
    const photo = Array.isArray(files.photo) ? files.photo[0] : files.photo;

    const TOKEN = process.env.TG_TOKEN;
    const CHAT_ID = process.env.TG_CHAT_ID;

    // Подготавливаем данные для Telegram
    const tgFormData = new FormData();
    tgFormData.append('chat_id', CHAT_ID);

    let telegramMethod = 'sendMessage';

    // Если пользователь прикрепил фото
    if (photo && photo.filepath && photo.size > 0) {
      telegramMethod = 'sendPhoto';
      tgFormData.append('photo', fs.createReadStream(photo.filepath));
      // Текст отзыва идет как подпись к фото
      tgFormData.append('caption', `🔔 Анонимный отзыв:\n\n${text || 'Без описания'}`);
    } else {
      // Если фото нет, шлем просто текст
      telegramMethod = 'sendMessage';
      tgFormData.append('text', `🔔 Анонимный отзыв:\n\n${text || 'Пустое сообщение'}`);
    }

    try {
      const response = await fetch(`https://telegram.org{TOKEN}/${telegramMethod}`, {
        method: 'POST',
        body: tgFormData,
        headers: tgFormData.getHeaders(), // Важно для передачи файлов
      });

      const result = await response.json();

      if (result.ok) {
        res.status(200).json({ ok: true });
      } else {
        res.status(400).json({ ok: false, description: result.description });
      }
    } catch (error) {
      res.status(500).json({ ok: false, description: "Ошибка на стороне сервера: " + error.message });
    }
  });
}
