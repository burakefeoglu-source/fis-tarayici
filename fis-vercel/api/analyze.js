export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY ayarlanmamış' });
  }

  try {
    const { imageBase64 } = req.body;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 800,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: 'image/jpeg', data: imageBase64 }
            },
            {
              type: 'text',
              text: 'Bu Türkiye fişini analiz et. SADECE JSON döndür, başka hiçbir şey yazma:\n{"firma":"","vkn":"","vd":"","il":"","ilce":"","tarih":"YYYY-MM-DD","tutar":"","kdvoran":"","kdvtutar":""}\nKurallar: tarih YYYY-MM-DD, kdvoran sadece 10/18/20 (sayı), tutar/kdvtutar noktalı ondalık, bulamazsan boş bırak.'
            }
          ]
        }]
      })
    });

    const data = await response.json();
    return res.status(response.status).json(data);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
