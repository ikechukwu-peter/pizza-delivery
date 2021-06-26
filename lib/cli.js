//Dependecies
const readline = require("readline");
const util = require("util");
const debug = util.debuglog("cli");
const events = require("events");
class _events extends events {}
let e = new _events();
const _data = require("./data");
//Instantiate the CLI
let cli = {};

// Input handlers
e.on("man", function (str) {
  cli.responders.help();
});

e.on("help", function (str) {
  cli.responders.help();
});

e.on("exit", function (str) {
  cli.responders.exit();
});

e.on("orders", function (str) {
  cli.responders.listOrders();
});
e.on("more order info", function (str) {
  cli.responders.moreOrderInfo();
});

e.on("list menus", function (str) {
  cli.responders.listMenus();
});
e.on("list users", function (str) {
  cli.responders.listUsers();
});
e.on("more user info", function (str) {
  cli.responders.moreUserInfo();
});

cli.responders = {};
// Help / Man
cli.responders.help = function () {
  // Codify the commands and their explanations
  let commands = {
    exit: "Kill the CLI (and the rest of the application)",
    man: "Show this help page",
    help: 'Alias of the "man" command',
    "list menu": "View all the current menu items",
    "list orders":
      "View all the recent orders in the system (orders placed in the last 24 hours)",
    "list orders --{orderId}":
      "Lookup the details of a specific order by order ID",
    "list users ": "View all the users who have signed up in the last 24 hours",
    "list users --{userEmail}":
      "Lookup the details of a specific user by email address ",
  };

  // Show a header for the help page that is as wide as the screen
  cli.horizontalLine();
  cli.centered("CLI MANUAL");
  cli.horizontalLine();
  cli.verticalSpace(2);

  // Show each command, followed by its explanation, in white and yellow respectively
  for (let key in commands) {
    if (commands.hasOwnProperty(key)) {
      let value = commands[key];
      let line = "      \x1b[33m " + key + "      \x1b[0m";
      let padding = 60 - line.length;
      for (i = 0; i < padding; i++) {
        line += " ";
      }
      line += value;
      console.log(line);
      cli.verticalSpace();
    }
  }
  cli.verticalSpace(1);

  // End with another horizontal line
  cli.horizontalLine();
};

// Create a vertical space
cli.verticalSpace = function (lines) {
  lines = typeof lines == "number" && lines > 0 ? lines : 1;
  for (i = 0; i < lines; i++) {
    console.log("");
  }
};

// Create a horizontal line across the screen
cli.horizontalLine = function () {
  // Get the available screen size
  let width = process.stdout.columns;

  // Put in enough dashes to go across the screen
  let line = "";
  for (i = 0; i < width; i++) {
    line += "-";
  }
  console.log(line);
};

// Create centered text on the screen
cli.centered = function (str) {
  str = typeof str == "string" && str.trim().length > 0 ? str.trim() : "";

  // Get the available screen size
  let width = process.stdout.columns;

  // Calculate the left padding there should be
  let leftPadding = Math.floor((width - str.length) / 2);

  // Put in left padded spaces before the string itself
  let line = "";
  for (i = 0; i < leftPadding; i++) {
    line += " ";
  }
  line += str;
  console.log(line);
};

// Exit
cli.responders.exit = function () {
  process.exit(0);
};

// Stats
cli.responders.listMenus = function () {
  // Create a header for the stats
  cli.horizontalLine();
  cli.centered("MENU ITEMS");
  cli.horizontalLine();
  cli.verticalSpace(2);
  _data.read("menu", "menu", (err, menuData) => {
    if (!err && menuData) {
      const menuItems = JSON.parse(JSON.stringify(menuData.menu.items));
      menuItems.map((index) => {
        //  Log out each menu
        console.log(index);

        cli.verticalSpace();
      });
    }
  });

  // Create a footer for the stats
  cli.verticalSpace();
  cli.horizontalLine();
};

// List Users
cli.responders.listUsers = function () {
  _data.list("users", function (err, userEmails) {
    if (!err && userEmails && userEmails.length > 0) {
      cli.verticalSpace();
      userEmails.forEach(function (userEmail) {
        _data.read("users", userEmail, function (err, userData) {
          if (!err && userData) {
            if (userData.dateOfRegistration <= Date.now() * 60 * 60 * 1000) {
              let line = `
              Name: ${userData.firstName} ${userData.lastName} 
              Email: ${userData.email} 
              Street Address: ${userData.streetAddress}`;
              console.log(line);
              cli.verticalSpace();
            }
          }
        });
      });
    }
  });
};

// List orders
cli.responders.listOrders = function (str) {
  // Lookup the user
  _data.read("orders", "orders", function (err, orderData) {
    if (!err && orderData) {
      if (orderData.dateOfOrder <= Date.now() * 60 * 60 * 1000) {
        // Print their JSON object with text highlighting
        cli.verticalSpace();
        console.dir(orderData, { colors: true });
        cli.verticalSpace();
      }
    }
  });
};

//More user info
cli.responders.moreUserInfo = function (str) {
  // Get ID from string
  let arr = str.split("--");
  let userId =
    typeof arr[1] == "string" && arr[1].trim().length > 0
      ? arr[1].trim()
      : false;
  if (userId) {
    // Lookup the user
    _data.read("users", userId, function (err, userData) {
      if (!err && userData) {
        // Print their JSON object with text highlighting
        cli.verticalSpace();
        console.dir(userData, { colors: true });
        cli.verticalSpace();
      }
    });
  }
};
//More user info
cli.responders.moreOrderInfo = function (str) {
  // Get ID from string
  let arr = str.split("--");
  let orderId =
    typeof arr[1] == "string" && arr[1].trim().length > 0
      ? arr[1].trim()
      : false;
  if (orderId) {
    // Lookup the user
    _data.read("users", orderId, function (err, orderData) {
      if (!err && orderData) {
        // Print their JSON object with text highlighting
        cli.verticalSpace();
        console.dir(orderData, { colors: true });
        cli.verticalSpace();
      }
    });
  }
};

// Input processor
cli.processInput = function (str) {
  str = typeof str == "string" && str.trim().length > 0 ? str.trim() : false;
  // Only process the input if the user actually wrote something, otherwise ignore it
  if (str) {
    // Codify the unique strings that identify the different unique questions allowed be the asked
    const uniqueInputs = [
      "man",
      "help",
      "exit",
      "list menus",
      "orders",
      "more order info",
      "list users",
      "more user info",
    ];

    // Go through the possible inputs, emit event when a match is found
    let matchFound = false;
    uniqueInputs.some(function (input) {
      if (str.toLowerCase().indexOf(input) > -1) {
        matchFound = true;
        // Emit event matching the unique input, and include the full string given
        e.emit(input, str);
        return true;
      }
    });

    // If no match is found, tell the user to try again
    if (!matchFound) {
      console.log(
        `${str} command doesn't exist. Type help to see available options`
      );
    }
  }
};

// Init script
cli.init = () => {
  // Send to console, in dark blue
  console.log("\x1b[34m%s\x1b[0m", "The CLI is running");

  // Start the interface
  let _interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "",
  });

  // Create an initial prompt
  _interface.prompt();

  // Handle each line of input separately
  _interface.on("line", (str) => {
    // Send to the input processor
    cli.processInput(str);

    // Re-initialize the prompt afterwards
    _interface.prompt();
  });

  // If the user stops the CLI, kill the associated process
  _interface.on("close", function () {
    process.exit(0);
  });
};

module.exports = cli;
