const express = require('express');
const store = require('../store');

const router = express.Router();

router.get('/', async (req, res) => {
  const tasks = await store.getTasks();
  res.json(tasks);
});

router.post('/', async (req, res) => {
  const { title } = req.body;
  if (!title || typeof title !== 'string') {
    return res.status(400).json({ error: 'title is required' });
  }
  const task = await store.addTask(title);
  res.status(201).json(task);
});

router.patch('/:id', async (req, res) => {
  const { title, done } = req.body;
  const changes = {};
  if (title !== undefined) changes.title = title;
  if (done !== undefined) changes.done = done;

  const task = await store.updateTask(req.params.id, changes);
  if (!task) return res.status(404).json({ error: 'task not found' });
  res.json(task);
});

router.delete('/:id', async (req, res) => {
  const deleted = await store.deleteTask(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'task not found' });
  res.status(204).end();
});

module.exports = router;
