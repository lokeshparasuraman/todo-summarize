import React, { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [summary, setSummary] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const API_BASE_URL = 'http://localhost:4000/api';
  const [slackStatus, setSlackStatus] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/todos`);
      if (!response.ok) throw new Error('Failed to fetch todos');
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const addTodo = async () => {
    if (!newTodo.trim()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newTodo })
      });
      if (!response.ok) throw new Error('Failed to add todo');
      const data = await response.json();
      setTodos([...todos, data]);
      setNewTodo('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/todos/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete a todo');
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.error('Error in deleting todo:', error);
    }
  };

  const summarizeTodos = async () => {
    if (todos.length === 0) {
      setShowSummary(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/summarize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to generate summary');
      const data = await response.json();
      setSummary(data.summary);
      setShowSummary(true);
      setSlackStatus('Summary sent to Slack successfully!');
    } catch (error) {
      console.error('Error summarizing todos:', error);
      setSummary('Failed to generate summary');
      setShowSummary(true);
      setSlackStatus('Failed to send to Slack');
    }
  };

  const hideSummary = () => {
    setShowSummary(false);
  };

  const deleteAllTodos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/todos`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete all todos');
      setTodos([]);
      setShowSummary(false);
      setSummary('');
    } catch (error) {
      console.error('Error deleting all todos:', error);
    }
  };

  return (
    <>
      <nav className="navbar">
        <h1>Todo Summarizer</h1>
      </nav>
      <div className="container">
        <div className="input-container">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Enter a new todo"
          />
          <button onClick={addTodo}>Add Todo</button>
          <button
            onClick={summarizeTodos}
            disabled={todos.length === 0}
          >
            Summarize Todos
          </button>
          <button
            className="delete-all-btn"
            onClick={deleteAllTodos}
            disabled={todos.length === 0}
          >
            Delete All
          </button>
        </div>

        {todos.map(todo => (
          <div key={todo._id} className="todo-item">
            <span>{todo.text}</span>
            <button onClick={() => deleteTodo(todo._id)}>Delete</button>
          </div>
        ))}

        {showSummary && summary && (
          <div className="summary-container">
            <h3>Summary:</h3>
            <p>{summary}</p>
            {slackStatus && <p className="slack-status">{slackStatus}</p>}
            <button onClick={hideSummary} className="close-summary">Close Summary</button>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
