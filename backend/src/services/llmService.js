import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OpenAI API key in environment variables');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 15000
});

export async function generateSummary(todos) {
  if (!Array.isArray(todos)) {
    throw new Error('Expected array of todos');
  }
  if (todos.length === 0) {
    return "No pending tasks - great job!";
  }
  try {
    const todoList = todos.map(t => `- ${t.text}`).join('\n');
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Summarize the following tasks briefly and clearly." },
        { role: "user", content: `Summarize these tasks:\n${todoList}` }
      ],
      max_tokens: 150,
      temperature: 0.7
    });
    if (!response || !response.choices || !response.choices[0]) {
      throw new Error('Invalid response from OpenAI API');
    }
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating summary:', error);
    throw new Error('Failed to generate summary: ' + error.message);
  }
}