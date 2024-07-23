const axios = require('axios');

exports.handler = async function(event, context) {
  try {
    const { prompt } = JSON.parse(event.body);

    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-3.5-turbo",
      messages: [
        {role: "system", content: "You are a helpful assistant that provides English-Spanish vocabulary words for children."},
        {role: "user", content: prompt}
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const words = parseResponse(response.data.choices[0].message.content);

    return {
      statusCode: 200,
      body: JSON.stringify(words)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch words', details: error.message })
    };
  }
}

function parseResponse(content) {
  // Implementa la lógica para parsear la respuesta de ChatGPT
  // y convertirla en un array de objetos {word: "...", translation: "..."}
  // Este es solo un ejemplo simplificado
  const lines = content.split('\n');
  return lines.map(line => {
    const [word, translation] = line.split('-').map(s => s.trim());
    return { word, translation };
  });
}
