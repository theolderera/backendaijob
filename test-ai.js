const { OpenAI } = require('openai');
const dotenv = require('dotenv');
dotenv.config();

async function test() {
  const apiKey = process.env.AI_API_KEY;
  const baseURL = process.env.AI_BASE_URL;
  const model = process.env.AI_MODEL;

  console.log('Testing with baseURL:', baseURL);
  console.log('Testing with model:', model);

  const openai = new OpenAI({ apiKey, baseURL });
  try {
    const response = await openai.chat.completions.create({
      model: model,
      messages: [{ role: 'user', content: 'Hello' }],
    });
    console.log('Response:', response.choices[0]?.message?.content);
  } catch (err) {
    console.error('Error Status:', err.status);
    console.error('Error Details:', err.error || err.message);
  }
}
test();
