//checkout
var stripe = Stripe(
  "pk_test_51I302uB8C1x0xe9hoTeElD1s5JxNRYtJraOWvRHr5Vy40YRWIJKsWbAGdL59oQz0bwMUbHLuoZauNnfSOdFt5dPX004BT0BOe9"
);

//Signs a user up
register = () => {
  var form = document.getElementById("accountCreate");
  let elements = [];
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    let elem = Array.from(form.elements);
    for (let i = 0; i <= elem.length - 3; i++) {
      elements.push(elem[i].value);
    }

    const firstName =
      typeof elements[0] == "string" && elements[0].trim().length > 0
        ? elements[0]
        : false;
    const lastName =
      typeof elements[1] == "string" && elements[1].trim().length > 0
        ? elements[1]
        : false;
    const email =
      typeof elements[2] == "string" && elements[2].trim().length > 0
        ? elements[2]
        : false;
    const password =
      typeof elements[3] == "string" && elements[3].trim().length > 0
        ? elements[3]
        : false;
    const streetAddress =
      typeof elements[4] == "string" && elements[4].trim().length > 0
        ? elements[4]
        : false;
    if (firstName && lastName && email && password && streetAddress) {
      // POST request using fetch()
      try {
        let request = await fetch("http://localhost:3000/api/users", {
          // Adding method type
          method: "POST",

          // Adding body or contents to send
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            password,
            streetAddress,
          }),

          // Adding headers to the request
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        });
        elements = [];
        let response = await request.json();
        console.log(response);
        if (response) {
          window.location = "/login";
        }
      } catch (err) {
        alert(err);
        window.location = "/register";
      }
    } else {
      alert("Please fill all the required field");
    }
  });
};

//Logs a user in
login = () => {
  const forms = document.getElementById("submitBtn");
  forms.addEventListener("click", async function (e) {
    e.preventDefault();
    let inputs = document.querySelectorAll("input");
    const email =
      typeof inputs[0].value == "string" && inputs[0].value.trim().length > 0
        ? inputs[0].value
        : false;
    const password =
      typeof inputs[1].value == "string" && inputs[1].value.trim().length > 0
        ? inputs[1].value
        : false;

    if (email && password) {
      try {
        let request = await fetch("http://localhost:3000/api/tokens", {
          // Adding method type
          method: "POST",

          // Adding body or contents to send
          body: JSON.stringify({
            email,
            password,
          }),

          // Adding headers to the request
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        });
        inputs = [];
        let response = await request.json();
        localStorage.setItem("token", response.tokenId);
        localStorage.setItem("email", response.email);
        if (response) {
          window.location = "http://localhost:3000/shopping";
        }
      } catch (err) {
        alert(err);
        window.href = "/login";
      }
    } else {
      alert("Please fill all the required fields");
    }
  });
};

//List all items from the database
const menu = async () => {
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");
  if (token && email) {
    try {
      let request = await fetch(
        `http://localhost:3000/api/menu?email=${email}`,
        {
          headers: {
            token,
          },
        }
      );
      let response = await request.json();
      const insertHTML = document.getElementById("ShoppingList");
      response.map((items) => {
        const html = `
        
        <div class="item_list">
         <h3 class="name"  >Name: ${items.name} </h3>
         <h3 class="price" >Price: ${items.price} </h3>
         <h4 class="sizes" >Size: ${items.sizes} </h3>
         <input type="hidden" class="hidden" value=${items.productCode} />
         <button type="submit" class="addToCart">Add to Cart </button>
         </div>
         
    `;
        insertHTML.insertAdjacentHTML("afterbegin", html);
      });
    } catch (err) {
      alert("Internal server error, please login again");
      window.location = "/login";
    }
  } else {
    alert("Error!!! Authorization missing ");
    window.location = "http://localhost:3000/login";
  }
};

//Adds to cart
function addToCart() {
  const buttons = document.querySelectorAll(".addToCart");
  for (let counter = 0; counter < buttons.length; counter++) {
    buttons[counter].addEventListener("click", function (e) {
      e.preventDefault();

      const name = buttons[counter].parentElement
        .querySelector(".name")
        .innerText.split(" ")[1];
      const price = buttons[counter].parentElement
        .querySelector(".price")
        .innerText.split(" ")[1];
      const sizes = buttons[counter].parentElement
        .querySelector(".sizes")
        .innerText.split(" ")[1];
      const hidden =
        buttons[counter].parentElement.querySelector(".hidden").value;
      addItemToCart(name, price, sizes, hidden);
      updateCartTotal();
    });
  }
}

//Adds a dynamic html when add to cart is clicked
function addItemToCart(name, price, hidden) {
  let cartRow = document.createElement("div");
  cartRow.classList.add("cart-row");
  let cartItems = document.getElementsByClassName("cart-items")[0];
  let cartItemNames = cartItems.getElementsByClassName("cart-item");
  for (var i = 0; i < cartItemNames.length; i++) {
    if (cartItemNames[i].innerText == name) {
      alert("This item is already added to the cart");
      return;
    }
  }
  var cartRowContents = `
      <div class="cart-item cart-column">
          <span class="cart-item-title">${name}</span>
      </div>
      <span class="cart-price cart-column">${price}</span>
      <input type="hidden" class="cart-hidden " value=${hidden} />

      <div class="cart-quantity cart-column">
          <input class="cart-quantity-input" type="number" value="1">
          <button class="btn btn-danger" type="button">REMOVE</button>
      </div>
      `;

  cartRow.innerHTML = cartRowContents;
  cartItems.append(cartRow);
  cartRow
    .getElementsByClassName("btn-danger")[0]
    .addEventListener("click", removeCartItem);
  cartRow
    .getElementsByClassName("cart-quantity-input")[0]
    .addEventListener("change", quantityChanged);
}

//Handles purchasing
async function purchaseClicked() {
  var cartItems = document.getElementsByClassName("cart-items")[0];
  var cartRows = cartItems.getElementsByClassName("cart-row");
  for (var i = 0; i < cartRows.length; i++) {
    var cartRow = cartRows[i];
    var identifier = cartRow.getElementsByClassName("cart-hidden")[0];
    var quantityElement = cartRow.getElementsByClassName(
      "cart-quantity-input"
    )[0];
    let uuid = Number(identifier.value);
    var quantity = Number(quantityElement.value);

    //make a request to the server with cartitems
    try {
      const request = await fetch("http://localhost:3000/api/cartitems", {
        method: "POST",
        body: JSON.stringify({
          menuItemId: uuid,
          quantity,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          token: localStorage.getItem("token"),
        },
      });
      const response = await request.json();
      if (response) {
        window.location = "http://localhost:3000/shopping";
      }
    } catch (err) {
      alert(err);
    }
  }
  //make a request to the order page
  try {
    const order = await fetch("http://localhost:3000/api/orders", {
      method: "POST",
      headers: {
        token: localStorage.getItem("token"),
      },
    });
    let result = await order.json();
    console.log(result);
    alert("Thank you for your purchase");
    //Checkout with stripe
    stripe
      .redirectToCheckout({
        sessionId: "cs_test_123456",
      })
      .then(function (result) {
        console.log(result);
      });
  } catch (err) {
    console.log(err);
  }
  //Remove from the UI
  while (cartItems.hasChildNodes()) {
    cartItems.removeChild(cartItems.firstChild);
  }

  updateCartTotal();
}

//Removes item from cart
function removeCartItem(event) {
  var buttonClicked = event.target;
  buttonClicked.parentElement.parentElement.remove();
  updateCartTotal();
}

//Updates the price of items based on quantity
function quantityChanged(event) {
  var input = event.target;
  if (isNaN(input.value) || input.value <= 0) {
    input.value = 1;
  }
  updateCartTotal();
}

//Calculates the price of items
function updateCartTotal() {
  var cartItemContainer = document.getElementsByClassName("cart-items")[0];
  var cartRows = cartItemContainer.getElementsByClassName("cart-row");
  var total = 0;
  for (var i = 0; i < cartRows.length; i++) {
    var cartRow = cartRows[i];
    var priceElement = cartRow.getElementsByClassName("cart-price")[0];
    var quantityElement = cartRow.getElementsByClassName(
      "cart-quantity-input"
    )[0];
    var price = parseFloat(priceElement.innerText.replace("$", ""));
    var quantity = quantityElement.value;
    total = total + price * quantity;
  }
  total = Math.round(total * 100) / 100;
  document.getElementsByClassName("cart-total-price")[0].innerText =
    "$" + total;
}

//Call all the functions
function ready() {
  var removeCartItemButtons = document.getElementsByClassName("btn-danger");
  for (var i = 0; i < removeCartItemButtons.length; i++) {
    var button = removeCartItemButtons[i];
    button.addEventListener("click", removeCartItem);
  }

  var quantityInputs = document.getElementsByClassName("cart-quantity-input");
  for (var i = 0; i < quantityInputs.length; i++) {
    var input = quantityInputs[i];
    input.addEventListener("change", quantityChanged);
  }
}

//LogOut
//Deletes session from the server
let logOut = document.querySelector(".logger");
logOut.addEventListener("click", async (e) => {
  e.preventDefault();
  const deleteToken = await fetch(
    `/api/tokens?id=${localStorage.getItem("token")}`,
    {
      method: "DELETE",
    }
  );
  if (deleteToken) {
    localStorage.clear();
    window.location = "/login";
  }
});

//wait for DOM loading
window.onload = function () {
  const pathname = window.location.pathname;
  const tokenInStorage = localStorage.getItem("token");
  if (tokenInStorage) {
    let logIn = document.querySelectorAll(".loggedIn");
    let logOut = document.querySelectorAll(".loggedOut");
    const loggedOut = Array.from(logOut);
    loggedOut.map((ul) => {
      ul.style.display = "none";
    });
    const loggedIn = Array.from(logIn);
    loggedIn.map((ul) => {
      ul.style.display = "inline-block";
    });
  }
  switch (pathname) {
    case "/login":
      if (tokenInStorage) {
        window.location = "http://localhost:3000/shopping";
      } else {
        login();
      }
      break;
    case "/register":
      register();
      break;
    case "/shopping":
      menu();
      break;
  }

  setTimeout(() => {
    addToCart();
  }, 1000);
  //Calls the purchase/order function
  document
    .getElementsByClassName("btn-purchase")[0]
    .addEventListener("click", purchaseClicked);
};
