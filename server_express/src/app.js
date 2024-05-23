// app.js
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./config/db');
const cors = require('cors')
const storyRoutes = require('./routes/storyRoutes');
const { serveSwagger } = require('./config/swaggerConfig');

const app = express();
const port = process.env.EXPRESS_PORT || 3000;

app.use(bodyParser.json());
app.use(cors());
app.use('/stories', storyRoutes);

serveSwagger(app);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
