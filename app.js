const express = require('express');

const logger = require('morgan');
const helmet = require('helmet')

const addressRouter = require('./routes/address');

const app = express();
const port = process.env.PORT || 3000

// middleware for logging server requests
app.use(logger('dev'));

// middleware for adding secruity to the express application by providing secure headers
app.use(helmet())

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/address', addressRouter);
app.use("*", (req, res) => {
  res.status(404).send("Not Found")
})
app.listen(port, () => console.log(`Listening on port ${port}`))
