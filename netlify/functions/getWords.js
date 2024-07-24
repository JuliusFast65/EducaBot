const axios = require('axios');

exports.handler = async function(event, context) {
  try {
    const { prompt } = JSON.parse(event.body);

    console.log('Sending request to OpenAI API with prompt:', prompt);

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

    console.log('Received response from OpenAI API:', JSON.stringify(response.data, null, 2));

    if (!response.data || !response.data.choices || response.data.choices.length === 0) {
      throw new Error('Unexpected response structure from OpenAI API');
    }

    const content = response.data.choices[0].message.content;
    console.log('Raw ChatGPT response:', content);

    const words = parseResponse(content);
    console.log('Parsed words:', words);

    return {
      statusCode: 200,
      body: JSON.stringify(words)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to fetch words', 
        details: error.message,
        stack: error.stack
      })
    };
  }
}

function parseResponse(content) {
  if (typeof content !== 'string') {
    console.error('Unexpected content type:', typeof content);
    console.error('Content:', content);
    return [];
  }

  const lines = content.split('\n').filter(line => line.trim() !== '');
  const words = [];

  for (const line of lines) {
    let [word, translation] = line.split(/[-:]/);
    
    if (!translation) {
      [word, ...translation] = line.split(' ');
      translation = translation.join(' ');
    }

    word = word.trim();
    translation = translation ? translation.trim() : '';

    if (word && translation) {
      words.push({ word, translation });
    }
  }

  return words;
}
