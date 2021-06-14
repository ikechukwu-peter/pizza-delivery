/*
 * Helpers for constious tasks
 *
 */

// Dependencies
const config = require("./config");
const crypto = require("crypto");
const https = require("https");
const querystring = require("querystring");

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

helpers.sendTwilioSms = function (phone, msg, callback) {
  // Validate parameters
  phone =
    typeof phone == "string" && phone.trim().length == 10
      ? phone.trim()
      : false;
  msg =
    typeof msg == "string" && msg.trim().length > 0 && msg.trim().length <= 1600
      ? msg.trim()
      : false;
  if (phone && msg) {
    // Configure the request payload
    const payload = {
      From: config.twilio.fromPhone,
      To: "+1" + phone,
      Body: msg,
    };
    const stringPayload = querystring.stringify(payload);

    // Configure the request details
    const requestDetails = {
      protocol: "https:",
      hostname: "api.twilio.com",
      method: "POST",
      path:
        "/2010-04-01/Accounts/" + config.twilio.accountSid + "/Messages.json",
      auth: config.twilio.accountSid + ":" + config.twilio.authToken,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(stringPayload),
      },
    };

    // Instantiate the request object
    const req = https.request(requestDetails, function (res) {
      // Grab the status of the sent request
      const status = res.statusCode;
      // Callback successfully if the request went through
      if (status == 200 || status == 201) {
        callback(false);
      } else {
        callback("Status code returned was " + status);
      }
    });

    // Bind to the error event so it doesn't get thrown
    req.on("error", function (e) {
      callback(e);
    });

    // Add the payload
    req.write(stringPayload);

    // End the request
    req.end();
  } else {
    callback("Given parameters were missing or invalid");
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
        console.log("Result from Stripe: " + data);
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
// Export the module
module.exports = helpers;
