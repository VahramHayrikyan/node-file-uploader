var handlers = require('./handlers');
var router = require('./router');
var server = require('./server');

var routes = {
  '/': handlers.home,
  '/home': handlers.home,
  '/upload': handlers.upload,
  '_static': handlers.serveStatic,
  '/preview/:filename': handlers.filePreview
};

server.start(router.route, routes);

// var express = require('express');
// var router = express.Router();
//
// // Home page route.
// router.get('/', function (req, res) {
//   res.send('Wiki home page');
// })
//
// // About page route.
// router.get('/about', function (req, res) {
//   res.send('About this wiki');
// })
//
// module.exports = router;
