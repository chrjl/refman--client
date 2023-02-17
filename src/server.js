// require process.env.API_SERVER

const express = require('express');
const serveIndex = require('serve-index');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');

const debug = require('debug')('app:server');

const app = express();

app.use(morgan('dev'));

const staticOptions = {
  dotfiles: 'ignore',
  extensions: ['html'],
};

const indexOptions = {
  icons: true,
  view: 'details',
};

app.use('/api', createProxyMiddleware({
  target: process.env.API_SERVER,
  pathRewrite: { '^/api': '' },
}));

app.use('/', express.static('static', staticOptions), serveIndex('static', indexOptions));

module.exports = app;
debug('exported express server');
