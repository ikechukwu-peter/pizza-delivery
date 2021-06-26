//Dependencies
const http = require("http");
const https = require("https");
const fs = require("fs");
const url = require("url");
const config = require("./config");
const { StringDecoder } = require("string_decoder");
const helpers = require("./helpers");
const handlers = require("./handlers");

//Instantiate the server module
const server = {};

//Instantiate server
server.httpServer = http.createServer((req, res) => {
  server.unifiedServer(req, res);
});

//Instantiate the https server
const httpsOption = {
  key: fs.readFileSync("./https/key.pem"),
  csr: fs.readFileSync("./https/csr.pem"),
};
server.httpsServer = https.createServer(httpsOption, () => {
  unifiedServer(req, res);
});

//All server logic
server.unifiedServer = function (req, res) {
  const parsedUrl = url.parse(req.url, true);

  // Get the path
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");

  // Get the query string as an object
  const queryStringObject = parsedUrl.query;

  // Get the HTTP method
  const method = req.method.toLowerCase();

  //Get the headers as an object
  const headers = req.headers;

  // Get the payload,if any
  const decoder = new StringDecoder("utf-8");
  let buffer = "";
  req.on("data", function (data) {
    buffer += decoder.write(data);
  });
  req.on("end", function () {
    buffer += decoder.end();

    // Check the router for a matching path for a handler. If one is not found, use the notFound handler instead.
    let chosenHandler =
      typeof server.router[trimmedPath] !== "undefined"
        ? server.router[trimmedPath]
        : handlers.notFound;

    // If the request is within the public directory use to the public handler instead
    chosenHandler =
      trimmedPath.indexOf("public/") > -1 ? handlers.public : chosenHandler;

    // Construct the data object to send to the handler
    const data = {
      trimmedPath: trimmedPath,
      queryStringObject: queryStringObject,
      method: method,
      headers: headers,
      payload: helpers.parseJsonToObject(buffer),
    };
    // Route the request to the handler specified in the router
    chosenHandler(data, function (statusCode, payload, contentType) {
      // Determine the type of response (fallback to JSON)
      contentType = typeof contentType == "string" ? contentType : "json";

      // Use the status code returned from the handler, or set the default status code to 200
      statusCode = typeof statusCode == "number" ? statusCode : 200;

      // Return the response parts that are content-type specific
      let payloadString = "";
      if (contentType == "json") {
        res.setHeader("Content-Type", "application/json");
        payload = typeof payload == "object" ? payload : {};
        payloadString = JSON.stringify(payload);
      }

      if (contentType == "html") {
        res.setHeader("Content-Type", "text/html");
        payloadString = typeof payload == "string" ? payload : "fuck node";
      }

      if (contentType == "favicon") {
        res.setHeader("Content-Type", "image/x-icon");
        payloadString = typeof payload !== "undefined" ? payload : "";
      }

      if (contentType == "plain") {
        res.setHeader("Content-Type", "text/plain");
        payloadString = typeof payload !== "undefined" ? payload : "";
      }

      if (contentType == "css") {
        res.setHeader("Content-Type", "text/css");
        payloadString = typeof payload !== "undefined" ? payload : "";
      }

      if (contentType == "png") {
        res.setHeader("Content-Type", "image/png");
        payloadString = typeof payload !== "undefined" ? payload : "";
      }

      if (contentType == "jpg") {
        res.setHeader("Content-Type", "image/jpeg");
        payloadString = typeof payload !== "undefined" ? payload : "";
      }
      // Return the response-parts common to all content-types
      res.writeHead(statusCode);
      res.end(payloadString);

      // If the response is 200, print green, otherwise print red
      if (statusCode === 200) {
        console.log(
          "\x1b[32m%s\x1b[0m",
          statusCode,
          trimmedPath,
          method.toUpperCase()
        );
      } else {
        console.log(
          "\x1b[31m%s\x1b[0m",
          statusCode,
          trimmedPath,
          method.toUpperCase()
        );
      }
    });
  });
};

//Define the request routers
server.router = {
  "": handlers.index,
  register: handlers.register,
  login: handlers.login,
  shopping: handlers.shoppingList,
  "account/view/all": handlers.viewAll,
  "account/fillCart": handlers.fillCart,
  "account/order": handlers.placeOrder,
  ping: handlers.ping,
  "api/users": handlers.users,
  "api/tokens": handlers.tokens,
  "api/menu": handlers.menu,
  "api/cartitems": handlers.cartitems,
  "api/orders": handlers.orders,
  public: handlers.public,
  favicon: handlers.favicon,
};

//Init server
server.init = () => {
  //Start server
  server.httpServer.listen(config.httpPort, () => {
    console.log(
      "\x1b[36m%s\x1b[0m",
      `The HTTP server listening on port: ${config.httpPort}`
    );
  });
  //Start the https server
  server.httpsServer.listen(config.httpsPort, () => {
    console.log(
      "\x1b[35m%s\x1b[0m",
      `The HTTPS server listening on port: ${config.httpsPort}`
    );
  });
};
module.exports = server;
