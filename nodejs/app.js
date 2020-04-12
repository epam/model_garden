const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const commonConstants = require('./constants/common.constants');
const cvatRoutes = require('./routes/cvat.routes');

const { API_HOST, API_PORT } = commonConstants;

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use('/cvat', cvatRoutes);

app.get('*', (req, res) => {
  res.send('not found...');
});

app.listen(API_PORT, API_HOST, () => {
  console.log(`Server started ${API_HOST}:${API_PORT}`);
});