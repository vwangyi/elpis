require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/chat', require('./routes/chat'));

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`server start on port ${PORT}`);
});
