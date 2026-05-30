import { config } from 'dotenv';
import OpenAI from 'openai';

config();

async function test() {
  const apiKey = process.env.AI_API_KEY;
  const baseURL = process.env.AI_BASE_URL;
  const model = process.env.AI_MODEL || 'gemini-2.5-flash';

  console.log('API Key:', apiKey ? 'Set (hidden)' : 'Not set');
  console.log('Base URL:', baseURL);
  console.log('Model:', model);

  if (!apiKey) {
    console.log('No API key provided.');
    return;
  }

  const openai = new OpenAI({ apiKey, baseURL });

  try {
    const response = await openai.chat.completions.create({
      model: model,
      messages: [{ role: 'user', content: 'Hello, testing Gemini API compatibility!' }],
    });
    console.log('Response:', response.choices[0]?.message?.content);
  } catch (error: any) {
    console.error('Error occurred:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

test();
