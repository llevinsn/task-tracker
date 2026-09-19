const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs/promises');
const path = require('path');
const store = require('../src/store');

const DATA_FILE = path.join(__dirname, '..', 'data', 'tasks.json');
let backup;

test.before(async () => {
  backup = await fs.readFile(DATA_FILE, 'utf-8');
});

test.after(async () => {
  await fs.writeFile(DATA_FILE, backup);
});

test('addTask crea una tarea con prioridad normal por defecto', async () => {
  const task = await store.addTask('Tarea de prueba');
  assert.equal(task.title, 'Tarea de prueba');
  assert.equal(task.done, false);
  assert.equal(task.priority, 'normal');
});

test('addTask respeta una prioridad explícita', async () => {
  const task = await store.addTask('Tarea urgente', 'high');
  assert.equal(task.priority, 'high');
});

test('updateTask fusiona cambios y devuelve null si no existe', async () => {
  const task = await store.addTask('Para actualizar');
  const updated = await store.updateTask(task.id, { done: true });
  assert.equal(updated.done, true);

  const missing = await store.updateTask('id-inexistente', { done: true });
  assert.equal(missing, null);
});

test('getTasks filtra por done cuando se pasa el filtro', async () => {
  const pending = await store.addTask('Pendiente');
  const done = await store.addTask('Hecha');
  await store.updateTask(done.id, { done: true });

  const onlyDone = await store.getTasks({ done: true });
  assert.ok(onlyDone.some((t) => t.id === done.id));
  assert.ok(!onlyDone.some((t) => t.id === pending.id));

  const onlyPending = await store.getTasks({ done: false });
  assert.ok(onlyPending.some((t) => t.id === pending.id));
  assert.ok(!onlyPending.some((t) => t.id === done.id));
});

test('countPending cuenta solo las tareas sin terminar', async () => {
  const before = await store.countPending();

  const pending = await store.addTask('Pendiente para el conteo');
  const done = await store.addTask('Hecha para el conteo');
  await store.updateTask(done.id, { done: true });

  const after = await store.countPending();
  assert.equal(after, before + 1);
});

test('deleteTask elimina la tarea y devuelve false si no existe', async () => {
  const task = await store.addTask('Para eliminar');
  const deleted = await store.deleteTask(task.id);
  assert.equal(deleted, true);

  const deletedAgain = await store.deleteTask(task.id);
  assert.equal(deletedAgain, false);
});
