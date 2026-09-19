const express = require('express');
const path = require('path');
const tasksRouter = require('./src/routes/tasks');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/tasks', tasksRouter);
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`Task Tracker corriendo en http://localhost:${PORT}`);
});
