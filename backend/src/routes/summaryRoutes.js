import { Router } from 'express';
import { generateSummary } from '../services/llmService.js';
import { sendToSlack } from '../services/slackService.js';
import Todo from '../models/Todo.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const todos = await Todo.find();
    if (todos.length === 0) {
      return res.status(400).json({ message: 'No todos to summarize' });
    }
    // Send only the todo list to Slack
    await sendToSlack(todos);
    // Generate summary for frontend only
    const summary = await generateSummary(todos);
    res.json({ success: true, summary });
  } catch (err) {
    console.error('Summary/Slack Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
