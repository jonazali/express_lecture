require('dotenv').config();
const express = require('express');
const path = require('path');
const shortid = require('shortid');
const cors = require('cors');
const logger = require('./middleware/logger');
const commentsRouter = require('./routes/comments');

const app = express();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/* set up middleware */
// body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// cors middleware
app.use(cors());

// static middleware
app.use(express.static(path.join(__dirname, 'public')));

// routing
app.use('/api/comments', commentsRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
