//Dependencies
const http = require("http");
const https = require("https");
const fs = require("fs");
const url = require("url");
const config = require("./lib/config");
const { StringDecoder } = require("string_decoder");
const helpers = require("./lib/helpers");
const handlers = require("./lib/handlers");

//Instantiate server
const httpServer = http.createServer((req, res) => {
  unifiedServer(req, res);
});

//Start server
httpServer.listen(config.httpPort, () => {
  console.log(`The HTTP server listening on port: ${config.httpPort}`);
});

//Instantiate the https server
const httpsOption = {
  key: fs.readFileSync("./https/key.pem"),
  csr: fs.readFileSync("./https/csr.pem"),
};
const httpsServer = https.createServer(httpsOption, () => {
  unifiedServer(req, res);
});

//Start the https server
httpsServer.listen(config.httpsPort, () => {
  console.log(`The HTTPS server listening on port: ${config.httpsPort}`);
});

//All server logic
const unifiedServer = function (req, res) {
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
    const chosenHandler =
      typeof router[trimmedPath] !== "undefined"
        ? router[trimmedPath]
        : handlers.notFound;

    // Construct the data object to send to the handler
    const data = {
      trimmedPath: trimmedPath,
      queryStringObject: queryStringObject,
      method: method,
      headers: headers,
      payload: helpers.parseJsonToObject(buffer),
    };
    // Route the request to the handler specified in the router
    chosenHandler(data, function (statusCode, payload) {
      // Use the status code returned from the handler, or set the default status code to 200
      statusCode = typeof statusCode == "number" ? statusCode : 200;

      // Use the payload returned from the handler, or set the default payload to an empty object
      payload = typeof payload == "object" ? payload : {};

      // Convert the payload to a string
      const payloadString = JSON.stringify(payload);

      // Return the response
      res.setHeader("Content-Type", "application/json");
      res.writeHead(statusCode);
      res.end(payloadString);
      console.log(trimmedPath, statusCode);
    });
  });
};

//Routers
const router = {
  ping: handlers.ping,
  users: handlers.users,
  tokens: handlers.tokens,
  menu: handlers.menu,
  cartitems: handlers.cartitems,
  orders: handlers.orders,
};
