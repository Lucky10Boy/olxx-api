const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config({});
const { readdirSync } = require('fs');
const path = require('path');
const corsOptions = require('./config/corsOptions');

const app = express();

app.use(helmet({ crossOriginEmbedderPolicy: false, originAgentCluster: true }));
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      'img-src': ["'self'", 'https: data: blob:'],
    },
  })
);
app.use(cors(corsOptions));

app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());
app.use(compression());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

const mongoConnection = process.env.MONGODB_CONNECTION.replace('<password>', process.env.MONGODB_PASSWORD);
// process.on('uncaughtException', (err) => {
//   console.log(err.name, err.message);
//   console.log('UNCAUGHT EXCEPTION ⚡⚡⚡⚡ Shutting down... ');
//   process.exit(1);
// });

mongoose.connect(
  mongoConnection,

  () => {
    console.log('to Db connected');
  }
);
// console.log(process.cwd());
// app.use(express.static('../client/build'));

app.listen(5555, () => {
  console.log('started the app!!!');
});
readdirSync('./routes').map((r) => app.use('/api/v1', require('./routes/' + r)));

// app.use('/', () => {
//   console.log('working');
// });
// process.on('unhandledRejection', (err) => {
//   console.log(err.name, err.message);
//   console.log('UNHANDLED REJECTION ⚡⚡⚡⚡ Shutting down... ');
//   server.close(() => {
//     process.exit(1);
//   });
// });

// test

process.on('SIGTERM', () => {
  console.log('SIGTERM RECIEVED. SHUTTING DOWN GRACEFULLY');
  server.close(() => {
    console.log('⚡⚡⚡ PROCESS TERMINATED');
  });
});
