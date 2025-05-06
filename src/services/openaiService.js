const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function analyzeFeedback(text) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            "Analyze the following feedback and return a JSON object with:\n          1. sentiment: a number between -1 (very negative) and 1 (very positive)\n          2. theme: one of ['bug', 'feature', 'ui', 'performance', 'security', 'other']\n          Be concise and only return the JSON object.",
        },
        {
          role: 'user',
          content: text,
        },
      ],
      temperature: 0.3,
      max_tokens: 100,
    });

    const result = JSON.parse(response.choices[0].message.content);

    // Validation des résultats
    if (typeof result.sentiment !== 'number' || result.sentiment < -1 || result.sentiment > 1) {
      throw new Error('Invalid sentiment value');
    }

    const validThemes = ['bug', 'feature', 'ui', 'performance', 'security', 'other'];
    if (!validThemes.includes(result.theme)) {
      throw new Error('Invalid theme value');
    }

    return result;
  } catch (error) {
    console.error('OpenAI analysis error:', error);
    // Valeurs par défaut en cas d'erreur
    return {
      sentiment: 0,
      theme: 'other',
    };
  }
}

module.exports = {
  analyzeFeedback,
};
