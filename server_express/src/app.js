// app.js
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./config/db');
const storyRoutes = require('./routes/storyRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/api/stories', storyRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
