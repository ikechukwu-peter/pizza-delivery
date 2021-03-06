/*
 * Primary file for API
 *
 */

// Dependencies
var server = require("./lib/server");
//var workers = require('./lib/workers');
let cli = require("./lib/cli");

// Declare the app
let app = {};

// Init function
app.init = function () {
  // Start the server
  server.init();

  // Start the workers
  //workers.init();

  //Start CLI
  cli.init();
};

// Self executing
app.init();

// Export the app
module.exports = app;
