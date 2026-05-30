import { config } from 'dotenv';
import OpenAI from 'openai';

config();

async function listModels() {
  const apiKey = process.env.AI_API_KEY;
  const baseURL = process.env.AI_BASE_URL;

  if (!apiKey) {
    console.log('No API key provided.');
    return;
  }

  const openai = new OpenAI({ apiKey, baseURL });

  try {
    const list = await openai.models.list();
    console.log('Available models:');
    for (const model of list.data) {
      console.log('-', model.id);
    }
  } catch (error: any) {
    console.error('Error fetching models:', error.message);
  }
}

listModels();
