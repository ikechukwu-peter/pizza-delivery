/*
 * Helpers for constious tasks
 *
 */

// Dependencies
const config = require("./config");
const crypto = require("crypto");
const https = require("https");
const querystring = require("querystring");
const path = require("path");
const fs = require("fs");

// Container for all the helpers
const helpers = {};

// Parse a JSON string to an object in all cases, without throwing
helpers.parseJsonToObject = function (str) {
  try {
    const obj = JSON.parse(str);
    return obj;
  } catch (e) {
    return {};
  }
};

// Create a SHA256 hash
helpers.hash = function (str) {
  if (typeof str == "string" && str.length > 0) {
    const hash = crypto
      .createHmac("sha256", config.hashingSecret)
      .update(str)
      .digest("hex");
    return hash;
  } else {
    return false;
  }
};

// Create a string of random alphanumeric characters, of a given length
helpers.createRandomString = function (strLength) {
  strLength = typeof strLength == "number" && strLength > 0 ? strLength : false;
  if (strLength) {
    // Define all the possible characters that could go into a string
    const possibleCharacters = "abcdefghijklmnopqrstuvwxyz0123456789";

    // Start the final string
    let str = "";
    for (i = 1; i <= strLength; i++) {
      // Get a random charactert from the possibleCharacters string
      let randomCharacter = possibleCharacters.charAt(
        Math.floor(Math.random() * possibleCharacters.length)
      );
      // Append this character to the string
      str += randomCharacter;
    }
    // Return the final string
    return str;
  } else {
    return false;
  }
};

helpers.validateEmail = (email) => {
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email);
};

//Charge with stripe
helpers.stripePayment = (amount, callback) => {
  //validate parameters
  amount = typeof amount === "number" ? amount : false;

  if (amount) {
    // Configure the request payload
    let payload = {
      amount: parseInt(amount.toFixed(2) * 100),
      currency: "usd",
      source: "tok_amex",
    };

    // Stringfy the payload
    let stringPayload = querystring.stringify(payload);

    // Configure the request details
    let requestDetails = {
      protocol: "https:",
      hostname: "api.stripe.com",
      method: "POST",
      path: "/v1/charges",
      auth: config.stripePaymentAuth,
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
        "Content-length": Buffer.byteLength(stringPayload),
      },
    };

    //Instantiate a request

    let req = https.request(requestDetails, (res) => {
      //Grab the status of the sent request
      let status = res.statusCode;

      //Used for debug
      res.setEncoding("utf8");
      res.on("data", function (data) {
        console.log("Result from Stripe: " + data);
      });

      //Callback successful if the request went through
      if (status === 200 || 201) {
        callback(false);
      } else {
        callback("Status code returned was " + status);
      }
    });

    // Bind to the error event so it doesn't get thrown
    req.on("error", (e) => {
      callback(e);
    });

    // Add the payload
    req.write(stringPayload);

    // End the request
    req.end();
  } else {
    callback("Given parameters are missing or invalid.");
  }
};

//Send receipt
helpers.sendMailgunEmail = (toEmail, toName, subject, message, callback) => {
  //validate parameters
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  toEmail =
    typeof toEmail === "string" && emailRegex.test(toEmail)
      ? toEmail.trim()
      : false;
  toName =
    typeof toName === "string" && toName.trim().length > 2
      ? toName.trim()
      : false;
  subject =
    typeof subject === "string" && subject.trim().length > 2
      ? subject.trim()
      : false;
  message =
    typeof message === "string" && message.trim().length > 2
      ? message.trim()
      : false;

  if (toEmail && toName && message) {
    // Configure the request payload
    let payload = {
      from: "Pizza App <postmaster@sandboxce401f34dde740fe828c865e3ad1b61f.mailgun.org>",
      to: toEmail,
      subject: subject,
      text: message,
    };

    // Stringfy the payload
    let stringPayload = querystring.stringify(payload);
    // Configure the request details
    let requestDetails = {
      protocol: "https:",
      hostname: "api.mailgun.net",
      method: "POST",
      path: "/v3/sandboxce401f34dde740fe828c865e3ad1b61f.mailgun.org/messages",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(stringPayload),
        Authorization:
          "Basic " +
          new Buffer("api:" + config.mailgunCredential, "utf8").toString(
            "base64"
          ),
      },
    };

    // Instantiate the request object
    let req = https.request(requestDetails, (res) => {
      // Grab the status of the sent request
      let status = res.statusCode;
      // Used for debug
      res.setEncoding("utf8");
      res.on("data", function (data) {
        console.log("Result from Mailguun: " + data);
      });

      // Callback successfuly if the request went through
      if (status == 200 || status == 201) {
        callback(false);
      } else {
        callback("Status code returned was " + status);
      }
    });

    // Bind to the error event so it doesn't get thrown
    req.on("error", (e) => {
      callback(e);
    });

    // Add the payload
    req.write(stringPayload);

    // End the request
    req.end();
  } else {
    callback("Given parameters are missing or invalid.");
  }
};

// Get the string content of a template, and use provided data for string interpolation
helpers.getTemplate = function (templateName, data, callback) {
  templateName =
    typeof templateName == "string" && templateName.length > 0
      ? templateName
      : false;
  data = typeof data == "object" && data !== null ? data : {};
  if (templateName) {
    var templatesDir = path.join(__dirname, "/../templates/");
    fs.readFile(
      templatesDir + templateName + ".html",
      "utf8",
      function (err, str) {
        if (!err && str && str.length > 0) {
          // Do interpolation on the string
          var finalString = helpers.interpolate(str, data);
          callback(false, finalString);
        } else {
          callback("No template could be found");
        }
      }
    );
  } else {
    callback("A valid template name was not specified");
  }
};

// Add the universal header and footer to a string, and pass provided data object to header and footer for interpolation
helpers.addUniversalTemplates = function (str, data, callback) {
  str = typeof str == "string" && str.length > 0 ? str : "";
  data = typeof data == "object" && data !== null ? data : {};
  // Get the header
  helpers.getTemplate("_header", data, function (err, headerString) {
    if (!err && headerString) {
      // Get the footer
      helpers.getTemplate("_footer", data, function (err, footerString) {
        if (!err && headerString) {
          // Add them all together
          var fullString = headerString + str + footerString;
          callback(false, fullString);
        } else {
          callback("Could not find the footer template");
        }
      });
    } else {
      callback("Could not find the header template");
    }
  });
};

// Take a given string and data object, and find/replace all the keys within it
helpers.interpolate = function (str, data) {
  str = typeof str == "string" && str.length > 0 ? str : "";
  data = typeof data == "object" && data !== null ? data : {};

  // Add the templateGlobals to the data object, prepending their key name with "global."
  for (var keyName in config.templateGlobals) {
    if (config.templateGlobals.hasOwnProperty(keyName)) {
      data["global." + keyName] = config.templateGlobals[keyName];
    }
  }
  // For each key in the data object, insert its value into the string at the corresponding placeholder
  for (var key in data) {
    if (data.hasOwnProperty(key) && typeof (data[key] == "string")) {
      var replace = data[key];
      var find = "{" + key + "}";
      str = str.replace(find, replace);
    }
  }
  return str;
};

// Get the contents of a static (public) asset
helpers.getStaticAsset = function (fileName, callback) {
  fileName =
    typeof fileName == "string" && fileName.length > 0 ? fileName : false;
  if (fileName) {
    var publicDir = path.join(__dirname, "/../public/");
    fs.readFile(publicDir + fileName, function (err, data) {
      if (!err && data) {
        callback(false, data);
      } else {
        callback("No file could be found");
      }
    });
  } else {
    callback("A valid file name was not specified");
  }
};

// Export the module
module.exports = helpers;
