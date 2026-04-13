import Busboy from 'busboy';

export const config = { api: { bodyParser: false } };

export default function handler(req, res) {
  const TOKEN = process.env.TG_TOKEN;
  const CHAT_ID = process.env.TG_CHAT_ID;
  const busboy = Busboy({ headers: req.headers });
  const formData = new URLSearchParams();
  formData.append('chat_id', CHAT_ID);

  let hasFile = false;

  busboy.on('field', (name, val) => {
    if (name === 'text') formData.append('caption', `🔔 Отзыв:\n${val}`);
  });

  busboy.on('file', (name, file, info) => {
    hasFile = true;
    const { filename, mimeType } = info;
    // Здесь сложная логика пересылки потока... 
  });

  // ДАВАЙ УПРОСТИМ ДО ПРЕДЕЛА.
