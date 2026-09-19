const express = require('express');
const store = require('../store');

const router = express.Router();
const PRIORITIES = ['low', 'normal', 'high'];

router.get('/pending/count', async (req, res) => {
  const count = await store.countPending();
  res.json({ count });
});

router.get('/', async (req, res) => {
  const { done } = req.query;
  const filter = {};
  if (done !== undefined) {
    if (done !== 'true' && done !== 'false') {
      return res.status(400).json({ error: 'done must be true or false' });
    }
    filter.done = done === 'true';
  }
  const tasks = await store.getTasks(filter);
  res.json(tasks);
});

router.post('/', async (req, res) => {
  const { title, priority } = req.body;
  if (!title || typeof title !== 'string') {
    return res.status(400).json({ error: 'title is required' });
  }
  if (priority !== undefined && !PRIORITIES.includes(priority)) {
    return res.status(400).json({ error: `priority must be one of ${PRIORITIES.join(', ')}` });
  }
  const task = await store.addTask(title, priority);
  res.status(201).json(task);
});

router.patch('/:id', async (req, res) => {
  const { title, done, priority } = req.body;
  if (priority !== undefined && !PRIORITIES.includes(priority)) {
    return res.status(400).json({ error: `priority must be one of ${PRIORITIES.join(', ')}` });
  }
  const changes = {};
  if (title !== undefined) changes.title = title;
  if (done !== undefined) changes.done = done;
  if (priority !== undefined) changes.priority = priority;

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
