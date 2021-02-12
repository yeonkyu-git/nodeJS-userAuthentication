const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');  // Cross-Origin Resource Sharing

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

require('dotenv').config();
const config = require('./config/key');

// Mongo DB Connect 
const mongoose = require('mongoose');
const connect = mongoose.connect(config.mongoURI,
  {
    useNewUrlParser: true, useUnifiedTopology: true,
    useCreateIndex: true, useFindAndModify: false
  })
  .then(() => console.log(`MongoDB Connect ${config.mongoURI}`))
  .catch(err => console.log(err));

// Cross-Origin Resource Sharing : 추후 React 의 Domain만 연결되도록 설정 필요함 
app.use(cors());

// Body-parser & Cookie-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Router
app.use('/api/user', require('./routes/users'))

// Server Listening 
app.listen(config.port, () => {
  console.log(`Server Listening on ${config.port}`)
})