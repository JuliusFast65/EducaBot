const axios = require('axios');

exports.handler = async function(event, context) {
  console.log('Function `getWords` invoked');
  
  if (event.httpMethod !== 'POST') {
    console.log('Method not allowed');
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let prompt;
  try {
    const body = JSON.parse(event.body);
    prompt = body.prompt;
    console.log('Received prompt:', prompt);
  } catch (error) {
    console.log('Error parsing request body:', error);
    return { statusCode: 400, body: 'Invalid JSON in request body' };
  }

  if (!prompt) {
    console.log('No prompt provided');
    return { statusCode: 400, body: 'Prompt is required' };
  }

  try {
    console.log('Sending request to OpenAI');
    const response = await axios.post(
      'https://api.openai.com/v1/engines/text-davinci-002/completions',
      {
        prompt: prompt,
        max_tokens: 1000,
        n: 1,
        stop: null,
        temperature: 0.7
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );

    console.log('Received response from OpenAI');
    return {
      statusCode: 200,
      body: JSON.stringify({ words: response.data.choices[0].text })
    };
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An error occurred while fetching words' })
    };
  }
};
