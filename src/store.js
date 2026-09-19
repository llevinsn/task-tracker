const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');

const DATA_FILE = path.join(__dirname, '..', 'data', 'tasks.json');

async function readAll() {
  const raw = await fs.readFile(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}

async function writeAll(tasks) {
  await fs.writeFile(DATA_FILE, JSON.stringify(tasks, null, 2));
}

async function getTasks() {
  return readAll();
}

async function addTask(title, priority = 'normal') {
  const tasks = await readAll();
  const task = { id: crypto.randomUUID(), title, done: false, priority };
  tasks.push(task);
  await writeAll(tasks);
  return task;
}

async function updateTask(id, changes) {
  const tasks = await readAll();
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return null;
  tasks[index] = { ...tasks[index], ...changes };
  await writeAll(tasks);
  return tasks[index];
}

async function deleteTask(id) {
  const tasks = await readAll();
  const next = tasks.filter((t) => t.id !== id);
  const deleted = next.length !== tasks.length;
  await writeAll(next);
  return deleted;
}

module.exports = { getTasks, addTask, updateTask, deleteTask };
