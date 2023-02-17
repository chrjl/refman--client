// requires process.env.{HTTP_PORT,API_SERVER}

const debug = require('debug')('app:index');

const server = require('./src/server');

const port = process.env.HTTP_PORT;

server.listen(port);
debug(`${process.env.npm_package_name} server listening on port ${port}`);
