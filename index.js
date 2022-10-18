const express = require('express');
const cors = require('cors');
const connection = require('./database/db');
const dotenv = require('dotenv');
dotenv.config();

const userRoutes = require('./routes/user.routes.js');

const app = express();

const corsOptions = {
  origin: 'http://localhost:7878',
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use('/api/users', userRoutes);

const port = process.env.PORT || 7878;

// 404 global error handler
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

// global error handler
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
});
