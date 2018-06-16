const port = 3000;
const config = require('./config/config');
const database = require('./config/database-config');
const express = require('express');

const app = express();
const environment = process.env.NODE_ENV || 'development';

database(config[environment]);
require('./config/express')(app);
require('./config/routes')(app);
require('./config/passport')();

app.listen(port);