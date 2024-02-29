var gameDetails = {
  bubbleShooter: {
    name: "Bubble Shooter",
    premium: false,
    unlocked: true,
    price: "0.10",
    id: "bubbleShooter",
    image: "bubbleShooter/icon-256.png",
  },
  hex: {
    name: "Hex",
    premium: false,
    unlocked: true,
    price: "0.10",
    id: "hex",
    image: "hex/icon-256.png",
  },
  parking: {
    name: "Parking Panic",
    premium: false,
    unlocked: true,
    price: "0.10",
    id: "parking",
    image: "parkingPanic/icon-256.png",
  },
  sudoku: {
    name: "Sudoku",
    premium: false,
    unlocked: true,
    price: "0.10",
    id: "sudoku",
    image: "sudoku/icon-256.png",
  },
  theGame13: {
    name: "The Game 13",
    premium: false,
    unlocked: true,
    price: "0.10",
    id: "theGame13",
    image: "theGame13/icon-256.png",
  },
  ticTacToe: {
    name: "Tic Tac Toe",
    premium: false,
    unlocked: true,
    price: "0.10",
    id: "ticTacToe",
    image: "ticTacToe/icon-256.png",
  },
  yatzyYahtzeeYams: {
    name: "Yatzy Yahtzee Yams",
    premium: false,
    unlocked: true,
    price: "0.10",
    id: "yatzyYahtzeeYams",
    image: "yatzyYahtzeeYams/icon-256.png",
  }
};
var usingPayPal = true; //false for no paypal
const editSavedGamesList = (gameId, flagValue) => {
  const savedGamesList = JSON.parse(localStorage.getItem("gamesList"));
  if (savedGamesList[`${gameId}`]) {
    savedGamesList[`${gameId}`] = (flagValue === "old") ? false : true;
    localStorage.setItem("gamesList", JSON.stringify(savedGamesList));
  }
};

$(document).ready(function () {
  getParams();
  if (Object.keys(params).length !== 0) {
    for (var [key, value] of Object.entries(params)) {
      // sort games alphabetically
      //pipeline testing
      if (key in gameDetails)
        gameDetails[key].unlocked = value == "true" ? true : false;
    }
  }
  var cookieString = decodeURIComponent(document.cookie);
  for ([key, value] of Object.entries(gameDetails)) {
    if (!cookieString.includes(key + "=true")) {
      if (value.unlocked == true) setCookie(key, true, 1);
      else {
        var gameElement = $("#" + key);
        gameElement.detach();
        $(".flexdiv").append(gameElement);
        $("#" + key + " .icon").css("opacity", "0.25");
        $("#" + key + " .gamename").css("opacity", "0.25");
        $("#" + key + " .gamename").text("Premium Game");
        $("#" + key + " .overlay").css("visibility", "visible");
      }
    } else gameDetails[key].unlocked = true;
    if (value.premium == true)
      $("#" + key + " .gameimg .icon").css(
        "box-shadow",
        "0 0 20px 8px #f49c04"
      );
  }

    $("#bubbleShooter").click(function () {
    if (gameDetails.bubbleShooter.unlocked == true) {
      location.href = "bubbleShooter/index.html";
      editSavedGamesList('bubbleShooter', 'old');
    } else createPurchaseContainer($(this).attr("id"));
  });
 

  $("#hex").click(function () {
    if (gameDetails.hex.unlocked == true) {
      location.href = "hex/index.html";
      editSavedGamesList('hex', 'old');
    } else createPurchaseContainer($(this).attr("id"));
  });
 
  $("#parking").click(function () {
    if (gameDetails.parking.unlocked == true) {
      location.href = "parkingPanic/index.html";
      editSavedGamesList('parking', 'old');
    } else createPurchaseContainer($(this).attr("id"));
  });
  
  $("#sudoku").click(function () {
    if (gameDetails.sudoku.unlocked == true) {
      location.href = "sudoku/index.html";
      editSavedGamesList('sudoku', 'old');
    } else createPurchaseContainer($(this).attr("id"));
  });
 
  $("#theGame13").click(function () {
    if (gameDetails.theGame13.unlocked == true) {
      location.href = "theGame13/index.html";
      editSavedGamesList('theGame13', 'old');
    } else createPurchaseContainer($(this).attr("id"));
  });
  
  $("#ticTacToe").click(function () {
    if (gameDetails.ticTacToe.unlocked == true) {
      location.href = "ticTacToe/index.html";
      editSavedGamesList('ticTacToe', 'old');
    } else createPurchaseContainer($(this).attr("id"));
  });
 
  $("#yatzyYahtzeeYams").click(function () {
    if (gameDetails.yatzyYahtzeeYams.unlocked == true) {
      location.href = "yatzyYahtzeeYams/index.html";
      editSavedGamesList('yatzyYahtzeeYams', 'old');
    } else createPurchaseContainer($(this).attr("id"));
  });
  
  $("body").css("opacity", 100);
});

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString(); //For demo, expires when app is shut down by default
  document.cookie = cname + "=" + cvalue + ";"; // + expires + ";path=/";
}

function createPurchaseContainer(id) {
  if ($("#rightContainer").length === 0) {
    $(".flexcontainer").css({
      width: "50%",
      height: "100vh",
      "align-items": "flex-start",
    });
    $(".flexdiv").css("margin-top", "50px");
    $("body").append(
      '<div id="rightContainer"><div id="bannerContainer">' +
      '<div id="betaBanner">Micropayment Beta</div>' +
      '<img id="return-button" src="../images/CLOSE.svg"></div>' +
      '<div id="preview-container"><img id="preview-image">' +
      '<div id="details"></div></div><div id="payment-button-container">' +
      '<div id="paypal-button-container"></div><div id="payment-button-divider">Or</div>' +
      '<div id="subscribe-button-container"></div></div></div>'
    );
    $("#return-button").click(function () {
      location.replace("index.html");
    });
  }
  generatePurchaseInformation(id);
}

function generatePurchaseInformation(id) {
  if (usingPayPal) {
    paypalButton = new PaymentButtons(
      "#paypal-button-container",
      gameDetails[id].price,
      gameDetails[id].name
    );
    paypalButton.removeButton();
    $("#paypal-button-container").append(
      "Purchase: $" + gameDetails[id].price + "<hr>"
    );
    paypalButton.createPayPalButton(function () {
      $("body").css("pointer-events", "none"); // Stops user from interrupting activation
      $("#rightContainer #details").text("Thank you for your purchase!");
      setCookie(id, true, 1);
      setTimeout(function () {
        history.back();
      }, 3000);
    });
  } else {
    $("#payment-button-divider").remove();
    $("#paypal-button-container").remove();
    $("#payment-button-container").css("padding-top", "0%");
    $("#subscribe-button-container").css({
      float: "none",
      "padding-right": "0%",
      margin: "auto",
    });
  }
  var imgsrc = $("#" + id + " .icon").attr("src");
  $("#details").empty();
  $("#preview-image").attr("src", imgsrc);
  $("#details").append(gameDetails[id].name);
  createSubscribeButton(id);
}

function createSubscribeButton(id) {
  $("#subscribe-button-container").empty();
  $("#subscribe-button-container").append(
    'Subscribe<hr><div id="subscribe-button"></div>'
  );
  $("#subscribe-button").append("<p>Access+</p>");
  $("#subscribe-button-container").click(function () {
    location.replace("../digitalstore/index.html?game=" + id);
  });
}
