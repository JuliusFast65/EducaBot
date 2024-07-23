const axios = require('axios');

exports.handler = async function(event, context) {
  // ... (el resto de la función permanece igual) ...
}

function parseResponse(content) {
  const lines = content.split('\n').filter(line => line.trim() !== '');
  const words = [];

  for (const line of lines) {
    // Intenta diferentes formatos de separación
    let [word, translation] = line.split(/[-:]/);
    
    // Si no se encuentra una separación clara, intenta dividir por el primer espacio
    if (!translation) {
      [word, ...translation] = line.split(' ');
      translation = translation.join(' ');
    }

    word = word.trim();
    translation = translation ? translation.trim() : '';

    // Verifica que tanto word como translation no estén vacíos
    if (word && translation) {
      words.push({ word, translation });
    }
  }

  // Log para depuración
  console.log('Parsed words:', words);

  return words;
}
