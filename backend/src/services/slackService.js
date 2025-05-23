import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export async function sendToSlack(todos) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    throw new Error('SLACK_WEBHOOK_URL is not defined in environment variables');
  }
  try {
    
    const text = Array.isArray(todos)
      ? todos.map((todo, idx) => `${idx + 1}. ${todo.text}`).join('\n')
      : JSON.stringify(todos, null, 2);
    const response = await axios.post(webhookUrl, { text });
    return response.data;
  } catch (error) {
    console.error('Error sending to Slack:', error.response?.data || error.message);
    throw new Error('Failed to send message to Slack: ' + (error.response?.data?.error || error.message));
  }
}

export default {
  sendToSlack
};
