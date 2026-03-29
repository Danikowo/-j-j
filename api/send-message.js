const https = require('https');

export default function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const { name, text } = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const TOKEN = process.env.TG_TOKEN;
    const CHAT_ID = process.env.TG_CHAT_ID;

    const data = JSON.stringify({
        chat_id: CHAT_ID,
        text: `🔔 Отзыв от: ${name}\n📝 Текст: ${text}`
    });

    const options = {
        hostname: 'api.telegram.org',
        port: 443,
        path: `/bot${TOKEN}/sendMessage`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    const request = https.request(options, (response) => {
        let responseData = '';
        response.on('data', (chunk) => { responseData += chunk; });
        response.on('end', () => {
            res.status(200).json(JSON.parse(responseData));
        });
    });

    request.on('error', (error) => {
        res.status(500).json({ ok: false, error: error.message });
    });

    request.write(data);
    request.end();
}
