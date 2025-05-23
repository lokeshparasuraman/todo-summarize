import { Router } from 'express';
import Todo from '../models/Todo.js';
const router = Router();

// GET all todos
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new todo
router.post('/', async (req, res) => {
  const todo = new Todo({ text: req.body.text });
  try {
    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE todo
router.delete('/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json({ message: 'Todo deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE all todos
router.delete('/', async (req, res) => {
  try {
    await Todo.deleteMany({});
    res.json({ message: 'All todos deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;