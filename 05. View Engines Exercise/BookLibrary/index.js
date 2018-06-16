const env = 'development';

const express = require('express');
const database = require('./config/database');
const settings = require('./config/settings')[env];
const server = require('./config/server');
const routes = require('./config/routes');

database(settings);

const app = express();
server(app);
routes(app);

const port = settings.port;

app.listen(port, () => console.log(`Server up and running on port ${port}...`));