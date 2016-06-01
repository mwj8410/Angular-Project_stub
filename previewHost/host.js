/* requirements */
var http = require('http');
var path = require('path');
var express = require('express');

/* variables */
var router = express(),
  server = http.createServer(router),
  serverPortNumber;

serverPortNumber = (function() {
  var possiblePort = process.env.PORT || parseInt(process.argv[2], 10);
  if (!(possiblePort) || !(possiblePort > 0)) {
    return 80; // Default port
  }
  return possiblePort;
})();

router.configure(function() {
  router.use(express.bodyParser());
  router.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });
});

// Mount development and production versions
router.use('/', express.static(path.resolve(__dirname, '../build/staging/html5/')));

server.listen(serverPortNumber, process.env.IP || '0.0.0.0', function() {
  process.stdout.write('Development and Preview server running at localhost:' + serverPortNumber + '.\n');
  server.address();
});
