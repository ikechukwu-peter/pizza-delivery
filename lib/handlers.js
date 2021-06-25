/*
 * Request Handlers
 *
 */

// Dependencies
const _data = require("./data");
const helpers = require("./helpers");

// Define all the handlers
const handlers = {};

/***
 *
 *
 * Client handlers
 */

// Index
handlers.index = function (data, callback) {
  // Reject any request that isn't a GET
  if (data.method == "get") {
    // Prepare data for interpolation
    let templateData = {
      "head.script": "https://js.stripe.com/v3/",

      "head.title": "Pizza Delivery - Made Simple",
      "head.description":
        "We offer purchasing and delivery of pizza everywhere!",
      "body.class": "index",
    };
    // Read in a template as a string
    helpers.getTemplate("index", templateData, function (err, str) {
      if (!err && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, function (err, str) {
          if (!err && str) {
            // console.log(typeof str);
            // console.log(str);
            // Return that page as HTML
            callback(200, str, "html");
          } else {
            callback(500, undefined, "html");
          }
        });
      } else {
        callback(500, undefined, "html");
      }
    });
  } else {
    callback(405, undefined, "html");
  }
};

//Signup || Register
handlers.register = (data, callback) => {
  // Reject any request that isn't a GET
  if (data.method == "get") {
    // Prepare data for interpolation
    // Prepare data for interpolation
    let templateData = {
      "head.script": "https://js.stripe.com/v3/",

      "head.title": "Create an Account",
      "head.description": "Signup is easy and only takes a few seconds.",
      "body.class": "accountCreate",
    };
    // Read in a template as a string
    helpers.getTemplate("register", templateData, function (err, str) {
      if (!err && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, function (err, str) {
          if (!err && str) {
            // console.log(typeof str);
            // console.log(str);
            // Return that page as HTML
            callback(200, str, "html");
          } else {
            callback(500, undefined, "html");
          }
        });
      } else {
        callback(500, undefined, "html");
      }
    });
  } else {
    callback(405, undefined, "html");
  }
};

//Login
//Creation of session
handlers.login = (data, callback) => {
  if (data.method == "get") {
    let templateData = {
      "head.script": "https://js.stripe.com/v3/",

      "head.title": "Login in your account",
      "heade.description": "Login in a jiffy!!",
      "body.class": "sessionCreate",
    };

    helpers.getTemplate("login", templateData, (err, str) => {
      if (!err && str) {
        //
        helpers.addUniversalTemplates(str, templateData, (err, str) => {
          if (!err && str) {
            callback(200, str, "html");
          } else {
            callback(500, undefined, "html");
          }
        });
      } else {
        callback(500, undefined, "html");
      }
    });
  } else {
    callback(405, undefined, "html");
  }
};

// shoppingList
//Return all the menu items

//Signup || Register
handlers.shoppingList = (data, callback) => {
  // Reject any request that isn't a GET
  if (data.method == "get") {
    // Prepare data for interpolation
    // Prepare data for interpolation
    let templateData = {
      "head.script": "https://js.stripe.com/v3/",
      "head.title": "Available products",
      "head.description": "Select freshly prepared pizza",
      "body.class": "shoppingList",
    };
    // Read in a template as a string
    helpers.getTemplate("shoppinglist", templateData, function (err, str) {
      if (!err && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, function (err, str) {
          if (!err && str) {
            // Return that page as HTML
            callback(200, str, "html");
          } else {
            callback(500, undefined, "html");
          }
        });
      } else {
        callback(500, undefined, "html");
      }
    });
  } else {
    callback(405, undefined, "html");
  }
};

// Favicon
handlers.favicon = function (data, callback) {
  // Reject any request that isn't a GET
  if (data.method == "get") {
    // Read in the favicon's data
    helpers.getStaticAsset("favicon.ico", function (err, data) {
      if (!err && data) {
        console.log(data);
        // Callback the data
        callback(200, data, "favicon");
      } else {
        callback(500);
      }
    });
  } else {
    callback(405);
  }
};

//Checkout
//Creation of session
handlers.checkout = (data, callback) => {
  if (data.method == "get") {
    let templateData = {
      "head.script": "https://js.stripe.com/v3/",
      "head.title": "Checkout",
      "head.description": "Awesome",
      "body.class": "session",
    };

    helpers.getTemplate("checkout", templateData, (err, str) => {
      if (!err && str) {
        //
        helpers.addUniversalTemplates(str, templateData, (err, str) => {
          if (!err && str) {
            callback(200, str, "html");
          } else {
            callback(500, undefined, "html");
          }
        });
      } else {
        callback(500, undefined, "html");
      }
    });
  } else {
    callback(405, undefined, "html");
  }
};

// Public assets
handlers.public = function (data, callback) {
  // Reject any request that isn't a GET
  if (data.method == "get") {
    // Get the filename being requested
    let trimmedAssetName = data.trimmedPath.replace("public/", "").trim();
    if (trimmedAssetName.length > 0) {
      // Read in the asset's data
      helpers.getStaticAsset(trimmedAssetName, function (err, data) {
        if (!err && data) {
          console.log(data);
          // Determine the content type (default to plain text)
          let contentType = "plain";

          if (trimmedAssetName.indexOf(".css") > -1) {
            contentType = "css";
          }

          if (trimmedAssetName.indexOf(".png") > -1) {
            contentType = "png";
          }

          if (trimmedAssetName.indexOf(".jpg") > -1) {
            contentType = "jpg";
          }

          if (trimmedAssetName.indexOf(".ico") > -1) {
            contentType = "favicon";
          }

          // Callback the data
          callback(200, data, contentType);
        } else {
          callback(404);
        }
      });
    } else {
      callback(404);
    }
  } else {
    callback(405);
  }
};

// Ping
handlers.ping = function (data, callback) {
  callback(200);
};

// Not-Found
handlers.notFound = function (data, callback) {
  callback(404);
};

// Users
handlers.users = function (data, callback) {
  const acceptableMethods = ["post", "get", "put", "delete"];
  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._users[data.method](data, callback);
  } else {
    callback(405);
  }
};

// Container for all the users methods
handlers._users = {};

// Users - post
// Required data: firstName, lastName, email, password, tosAgreement
// Optional data: none
handlers._users.post = function (data, callback) {
  // Check that all required fields are filled out
  const firstName =
    typeof data.payload.firstName == "string" &&
    data.payload.firstName.trim().length > 0
      ? data.payload.firstName.trim()
      : false;
  const lastName =
    typeof data.payload.lastName == "string" &&
    data.payload.lastName.trim().length > 0
      ? data.payload.lastName.trim()
      : false;
  const email =
    typeof data.payload.email == "string" &&
    helpers.validateEmail(data.payload.email)
      ? data.payload.email.trim()
      : false;
  const password =
    typeof data.payload.password == "string" &&
    data.payload.password.trim().length > 0
      ? data.payload.password.trim()
      : false;
  const streetAddress =
    typeof data.payload.streetAddress == "string" &&
    data.payload.streetAddress.trim().length > 0
      ? data.payload.streetAddress
      : false;

  if (firstName && lastName && email && password && streetAddress) {
    // Make sure the user doesnt already exist
    _data.read("users", email, function (err, data) {
      if (err) {
        // Hash the password
        const hashedPassword = helpers.hash(password);

        // Create the user object
        if (hashedPassword) {
          const userObject = {
            firstName,
            lastName,
            email,
            streetAddress,
            hashedPassword,
          };

          // Store the user
          _data.create("users", email, userObject, function (err) {
            if (!err) {
              callback(200);
            } else {
              console.log(err);
              callback(500, { Error: "Could not create the new user" });
            }
          });
        } else {
          callback(500, { Error: "Could not hash the user's password." });
        }
      } else {
        // User alread exists
        callback(400, {
          Error: "A user with that email address already exists",
        });
      }
    });
  } else {
    callback(400, { Error: "Missing required fields" });
  }
};

// Required data: email
// Optional data: none
handlers._users.get = function (data, callback) {
  // Check that email is valid
  console.log(data);
  const email =
    typeof data.queryStringObject.email == "string" &&
    helpers.validateEmail(data.queryStringObject.email)
      ? data.queryStringObject.email.trim()
      : false;
  if (email) {
    // Get token from headers
    const token =
      typeof data.headers.token == "string" ? data.headers.token : false;
    // Verify that the given token is valid for the email address
    handlers._tokens.verifyToken(token, email, function (tokenIsValid) {
      if (tokenIsValid) {
        // Lookup the user
        _data.read("users", email, function (err, data) {
          if (!err && data) {
            // Remove the hashed password from the user user object before returning it to the requester
            delete data.hashedPassword;
            callback(200, data);
          } else {
            callback(404);
          }
        });
      } else {
        callback(403, {
          Error: "Missing required token in header, or token is invalid.",
        });
      }
    });
  } else {
    callback(400, { Error: "Missing required field" });
  }
};

// Required data: email
// Optional data: firstName, lastName, password (at least one must be specified)
handlers._users.put = function (data, callback) {
  // Check for required field
  const email =
    typeof data.payload.email == "string" &&
    helpers.validateEmail(data.payload.email)
      ? data.payload.email.trim()
      : false;

  // Check for optional fields
  const firstName =
    typeof data.payload.firstName == "string" &&
    data.payload.firstName.trim().length > 0
      ? data.payload.firstName.trim()
      : false;
  const lastName =
    typeof data.payload.lastName == "string" &&
    data.payload.lastName.trim().length > 0
      ? data.payload.lastName.trim()
      : false;
  const streetAddress =
    typeof data.payload.streetAddress == "string" &&
    data.payload.streetAddress.trim().length > 0
      ? data.payload.streetAddress
      : false;
  const password =
    typeof data.payload.password == "string" &&
    data.payload.password.trim().length > 0
      ? data.payload.password.trim()
      : false;

  // Error if email is invalid
  if (email) {
    // Error if nothing is sent to update
    if (firstName || lastName || password || streetAddress) {
      // Get token from headers
      const token =
        typeof data.headers.token == "string" ? data.headers.token : false;

      // Verify that the given token is valid for the email addresss
      handlers._tokens.verifyToken(token, email, function (tokenIsValid) {
        if (tokenIsValid) {
          // Lookup the user
          _data.read("users", email, function (err, userData) {
            if (!err && userData) {
              // Update the fields if necessary
              if (firstName) {
                userData.firstName = firstName;
              }
              if (lastName) {
                userData.lastName = lastName;
              }
              if (password) {
                userData.hashedPassword = helpers.hash(password);
              }
              // Store the new updates
              _data.update("users", email, userData, function (err) {
                if (!err) {
                  callback(200);
                } else {
                  callback(500, { Error: "Could not update the user." });
                }
              });
            } else {
              callback(400, { Error: "Specified user does not exist." });
            }
          });
        } else {
          callback(403, {
            Error: "Missing required token in header, or token is invalid.",
          });
        }
      });
    } else {
      callback(400, { Error: "Missing fields to update." });
    }
  } else {
    callback(400, { Error: "Missing required field." });
  }
};

// Required data: email
handlers._users.delete = function (data, callback) {
  // Check that email address is valid
  const email =
    typeof data.queryStringObject.email == "string" &&
    helpers.validateEmail(data.queryStringObject.email)
      ? data.queryStringObject.email.trim()
      : false;

  if (email) {
    // Get token from headers
    const token =
      typeof data.headers.token == "string" ? data.headers.token : false;

    // Verify that the given token is valid for the email address
    handlers._tokens.verifyToken(token, email, function (tokenIsValid) {
      if (tokenIsValid) {
        // Lookup the user
        _data.read("users", email, function (err, userData) {
          if (!err && userData) {
            // Delete the user's data
            _data.delete("users", email, function (err) {
              if (!err) {
                callback(203, {});
              }
            });
          } else {
            callback(400, { Error: "Could not find the specified user." });
          }
        });
      } else {
        callback(403, {
          Error: "Missing required token in header, or token is invalid.",
        });
      }
    });
  } else {
    callback(400, { Error: "Missing required field" });
  }
};

// Tokens
handlers.tokens = function (data, callback) {
  const acceptableMethods = ["post", "get", "put", "delete"];
  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._tokens[data.method](data, callback);
  } else {
    callback(405);
  }
};

// Container for all the tokens methods
handlers._tokens = {};

// Tokens - post
// Required data: email, password
// Optional data: none
handlers._tokens.post = function (data, callback) {
  const email =
    typeof data.payload.email == "string" &&
    helpers.validateEmail(data.payload.email)
      ? data.payload.email.trim()
      : false;
  const password =
    typeof data.payload.password == "string" &&
    data.payload.password.trim().length > 0
      ? data.payload.password.trim()
      : false;
  if (email && password) {
    // Lookup the user who matches that email number
    _data.read("users", email, function (err, userData) {
      if (!err && userData) {
        // Hash the sent password, and compare it to the password stored in the user object
        const hashedPassword = helpers.hash(password);
        if (hashedPassword == userData.hashedPassword) {
          // If valid, create a new token with a random name. Set an expiration date 1 hour in the future.
          const tokenId = helpers.createRandomString(20);
          const expires = Date.now() + 1000 * 60 * 60;
          const tokenObject = {
            email,
            tokenId,
            expires,
          };

          // Store the token
          _data.create("tokens", tokenId, tokenObject, function (err) {
            if (!err) {
              callback(200, tokenObject);
            } else {
              callback(500, { Error: "Could not create the new token" });
            }
          });
        } else {
          callback(400, {
            Error:
              "Password did not match the specified user's stored password",
          });
        }
      } else {
        callback(400, { Error: "Could not find the specified user." });
      }
    });
  } else {
    callback(400, { Error: "Missing required field(s)." });
  }
};

// Tokens - get
// Required data: id
// Optional data: none
handlers._tokens.get = function (data, callback) {
  // Check that id is valid
  const id =
    typeof data.queryStringObject.id == "string" &&
    data.queryStringObject.id.trim().length === 20
      ? data.queryStringObject.id.trim()
      : false;
  if (id) {
    // Lookup the token
    _data.read("tokens", id, function (err, tokenData) {
      if (!err && tokenData) {
        callback(200, tokenData);
      } else {
        callback(404);
      }
    });
  } else {
    callback(400, { Error: "Missing required field, or field invalid" });
  }
};

// Tokens - put
// Required data: id, extend
// Optional data: none
handlers._tokens.put = function (data, callback) {
  const id =
    typeof data.payload.id == "string" && data.payload.id.trim().length === 20
      ? data.payload.id.trim()
      : false;
  const extend =
    typeof data.payload.extend == "boolean" && data.payload.extend == true
      ? true
      : false;
  if (id && extend) {
    // Lookup the existing token
    _data.read("tokens", id, function (err, tokenData) {
      if (!err && tokenData) {
        // Check to make sure the token isn't already expired
        if (tokenData.expires > Date.now()) {
          // Set the expiration an hour from now
          tokenData.expires = Date.now() + 1000 * 60 * 60;
          // Store the new updates
          _data.update("tokens", id, tokenData, function (err) {
            if (!err) {
              callback(200);
            } else {
              callback(500, {
                Error: "Could not update the token's expiration.",
              });
            }
          });
        } else {
          callback(400, {
            Error: "The token has already expired, and cannot be extended.",
          });
        }
      } else {
        callback(400, { Error: "Specified user does not exist." });
      }
    });
  } else {
    callback(400, {
      Error: "Missing required field(s) or field(s) are invalid.",
    });
  }
};

// Tokens - delete
// Required data: id
// Optional data: none
handlers._tokens.delete = function (data, callback) {
  // Check that id is valid
  const id =
    typeof data.queryStringObject.id == "string" &&
    data.queryStringObject.id.trim().length == 20
      ? data.queryStringObject.id.trim()
      : false;
  if (id) {
    // Lookup the token
    _data.read("tokens", id, function (err, tokenData) {
      if (!err && tokenData) {
        // Delete the token
        _data.delete("tokens", id, function (err) {
          if (!err) {
            callback(200);
          } else {
            callback(500, { Error: "Could not delete the specified token" });
          }
        });
      } else {
        callback(400, { Error: "Could not find the specified token." });
      }
    });
  } else {
    callback(400, { Error: "Missing required field" });
  }
};

// Verify if a given token id is currently valid for a given user
handlers._tokens.verifyToken = function (id, email, callback) {
  // Lookup the token
  _data.read("tokens", id, function (err, tokenData) {
    if (!err && tokenData) {
      // Check that the token is for the given user and has not expired
      if (tokenData.email == email && tokenData.expires > Date.now()) {
        callback(true);
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  });
};

//Menu
handlers.menu = function (data, callback) {
  const acceptableMethods = ["get"];
  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._menu[data.method](data, callback);
  } else {
    callback(405);
  }
};

//Container
handlers._menu = {};

//Menu - get
//Required data: token, email
//Optional: none

handlers._menu.get = (data, callback) => {
  // Check that email address is valid
  const email =
    typeof data.queryStringObject.email == "string" &&
    helpers.validateEmail(data.queryStringObject.email)
      ? data.queryStringObject.email.trim()
      : false;
  console.log(email);

  if (email) {
    // Get token from headers
    const token =
      typeof data.headers.token == "string" ? data.headers.token : false;

    // Verify that the given token is valid for the email address
    handlers._tokens.verifyToken(token, email, function (tokenIsValid) {
      if (tokenIsValid) {
        //Set the name of the file
        const menu = "menu";
        // Lookup the user
        _data.read("menu", menu, function (err, menuItems) {
          if (!err && menuItems) {
            const menuData = JSON.parse(JSON.stringify(menuItems));
            let items = [];
            for (const item of menuData.menu.items) {
              items.push(item);
            }
            callback(200, items);
          } else {
            callback(400, {
              Error:
                "Could not find the specified user and therefore could not return a menu.",
            });
          }
        });
      } else {
        callback(403, {
          Error: "Missing required token in header, or token is invalid.",
        });
      }
    });
  } else {
    callback(400, { Error: "Missing required field" });
  }
};

// Cart Items
handlers.cartitems = (data, callback) => {
  var acceptableMethods = ["post", "delete"];
  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._cartitems[data.method](data, callback);
  } else {
    callback(405);
  }
};

// Container for all the cart items methods
handlers._cartitems = {};

// Cart items - post
// Required data: menuitem id, quantity
// Optional data: none
handlers._cartitems.post = (data, callback) => {
  //Convert inputs to number
  const itemId = Number(data.payload.menuItemId);
  const itemQty = Number(data.payload.quantity);
  // validate inputs
  let menuItemId =
    typeof itemId === "number" && itemId % 1 == 0 ? itemId : false;
  let quantity =
    typeof itemQty === "number" && itemQty % 1 == 0 && itemQty > 0
      ? itemQty
      : false;
  if (menuItemId && quantity) {
    // Get token from headers
    const token =
      typeof data.headers.token == "string" ? data.headers.token : false;

    // Verify that the given token is valid
    _data.read("tokens", token, function (err, tokenData) {
      if (!err && tokenData) {
        let userEmail = tokenData.email;

        // Lookup the user
        _data.read("users", userEmail, function (err, userData) {
          if (!err && userData) {
            let cartItems =
              typeof userData.cartItems == "object" &&
              userData.cartItems instanceof Array
                ? userData.cartItems
                : [];
            newCartItem = {
              menuItemId: menuItemId,
              quantity: quantity,
            };

            // Add the item to user's cart
            userData.cartItems = cartItems;
            userData.cartItems.push(newCartItem);

            //Save the user data
            _data.update("users", userEmail, userData, (err) => {
              if (!err) {
                // Return the data about the new check
                callback(200);
              } else {
                callback(500, {
                  Error: "Could not update the user with the new cart item.",
                });
              }
            });

            // ;
            // const name = menuData.menu.items.map((item) => {
            // });
          } else {
            callback(400, {
              Error: "Could not find the specified user.",
            });
          }
        });
      } else {
        callback(403, {
          Error: "Missing required token in header, or token is invalid.",
        });
      }
    });
  } else {
    callback(400, { Error: "Missing required field" });
  }
};

//Cart Item delete
//Required data: menuItemId
handlers._cartitems.delete = (data, callback) => {
  let menuItemId = Number(data.queryStringObject.menuItemId);

  // Check that the id is valid
  menuItemId = menuItemId > 0 ? menuItemId : false;
  if (menuItemId) {
    //Get the token from the header
    let token =
      typeof data.headers.token === "string" ? data.headers.token : false;

    //Look up the user using the token
    _data.read("tokens", token, (err, tokenData) => {
      if (!err && tokenData) {
        let userEmail = tokenData.email;

        //Look up user
        _data.read("users", userEmail, (err, userData) => {
          if (!err && userData) {
            let cartItems =
              typeof userData.cartItems == "object" &&
              userData.cartItems instanceof Array
                ? userData.cartItems
                : false;

            if (cartItems.length > 0) {
              //Filter out this menu's item from user cart item
              updatedCartItems = cartItems.filter(
                (item) => item.menuItemId != menuItemId
              );
              userData.cartItems = updatedCartItems;

              _data.update("users", userEmail, userData, (err) => {
                if (!err) {
                  callback(200);
                } else {
                  callback(500, { Error: "Unable to update the user cart" });
                }
              });
            } else {
              callback(400, {
                Error:
                  "Could not delete cart item, because it is already empty",
              });
            }
          } else {
            callback(4000, {
              Error: "Could not find the specified user",
            });
          }
        });
      } else
        callback(403, {
          Error: "Missing required token in header, or token is invalid",
        });
    });
  } else callback(400, { Error: "Missing required field" });
};

// Orders
handlers.orders = (data, callback) => {
  var acceptableMethods = ["post"];
  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._orders[data.method](data, callback);
  } else {
    callback(405);
  }
};

// Container for all the order methods
handlers._orders = {};

// Orders - post
// Required data: none
// Optional data: none
handlers._orders.post = (data, callback) => {
  //Get the token from headers
  let token =
    typeof data.headers.token == "string" ? data.headers.token : false;

  //Read the token
  _data.read("tokens", token, (err, tokenData) => {
    if (!err && tokenData) {
      let userEmail = tokenData.email;
      //Look up user
      _data.read("users", userEmail, (err, userData) => {
        if (!err && userData) {
          let cartItems =
            typeof userData.cartItems == "object" &&
            userData.cartItems instanceof Array
              ? userData.cartItems
              : [];

          if (cartItems.length > 0) {
            // Get item prices
            let totalAmount = 0;

            //Hardcoded name of the file where the menu items is located
            const menu = "menu";
            _data.read("menu", menu, (err, menuData) => {
              if (!err && menuData) {
                const menuitemsData = menuData.menu.items;
                cartItems.forEach((cartItem) => {
                  // Get the price for this item
                  menuitemsData.forEach((menuItemData) => {
                    if (cartItem.menuItemId == menuItemData.productCode) {
                      // Calculates the total of this item based on the quantity
                      totalAmount += menuItemData.price * cartItem.quantity;
                    }
                  });
                });
                helpers.stripePayment(totalAmount, (err) => {
                  if (!err) {
                    //Clean user cart
                    userData.cartItems = [];
                    //Save the new user
                    _data.update("users", userEmail, userData, (err) => {
                      if (!err) {
                        //Send e-mail with a receipt
                        let toEmail = userData.email;
                        let toName =
                          userData.firstName + " " + userData.lastName;
                        let subject = "Your Pizza Receipt";
                        let message = `Thank you ${toName}, you successfuly purchased $${+totalAmount.toFixed(
                          2
                        )} worth of Pizza.`;

                        helpers.sendMailgunEmail(
                          toEmail,
                          toName,
                          subject,
                          message,
                          (err) => {
                            if (!err) {
                              callback(200);
                            } else {
                              callback(500, {
                                Error: "Unable to send receipt via e-mail",
                                err,
                              });
                            }
                          }
                        );
                      } else {
                        callback(500, {
                          Error:
                            "Unable to charge credit card in Stripe: " + err,
                        });
                      }
                    });
                  } else {
                    callback(500, {
                      Error: "Could not cleanup user's cart.",
                      err,
                    });
                  }
                });
              } else {
                callback(500, { Error: "Unable to get the menu items" });
              }
            });
          } else {
            callback(500, {
              Error:
                "Shopping cart is empty. To place an order there must be at least one item in the cart.",
            });
          }
        } else {
          callback(403);
        }
      });
    } else {
      callback(403);
    }
  });
};

// Export the handlers
module.exports = handlers;
