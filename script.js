var gameDetails = {
  // bricks: {
  //   name: "Bricks Breaker",
  //   premium: false,
  //   unlocked: true,
  //   price: "0.10",
  // },
  candy: {
    name: "Lollipop World",
    premium: false,
    unlocked: true,
    price: "0.10",
  },
  // defenders: {
  //   name: "Defenders",
  //   premium: true,
  //   unlocked: false,
  //   price: "0.10",
  // },
  // hex: {
  //   name: "Hex",
  //   premium: false,
  //   unlocked: true,
  //   price: "0.10",
  // },
  parking: {
    name: "Parking Panic",
    premium: false,
    unlocked: true,
    price: "0.10",
  },
  // plumber: {
  //   name: "Plumber World",
  //   premium: false,
  //   unlocked: true,
  //   price: "0.10",
  // },
  // tangram: {
  //   name: "Tangram Puzzle",
  //   premium: false,
  //   unlocked: true,
  //   price: "0.10",
  // },
  // solitaire: {
  //   name: "Solitaire",
  //   premium: false,
  //   unlocked: true,
  //   price: "0.10",
  // },
  // sudoku: {
  //   name: "Sudoku",
  //   premium: false,
  //   unlocked: true,
  //   price: "0.10",
  // },
  // ticTacToe: {
  //   name: "Tic Tac Toe",
  //   premium: false,
  //   unlocked: true,
  //   price: "0.10",
  // },
  // petitsChevauxSH: {
  //   name: "Petits Chevaux",
  //   premium: false,
  //   unlocked: true,
  //   price: "0.10",
  // },
  // yatzyYahtzee: {
  //   name: "YatzyYahtzee",
  //   premium: false,
  //   unlocked: true,
  //   price: "0.10",
  // },
  // ten: {
  //   name: "TenXTen",
  //   premium: false,
  //   unlocked: true,
  //   price: "0.10",
  // },
  // align4Big: {
  //   name: "Align 4 Big",
  //   premium: false,
  //   unlocked: true,
  //   price: "0.10",
  // },
  // chooChooConnect: {
  //   name: "Choo Choo Connect",
  //   premium: false,
  //   unlocked: true,
  //   price: "0.10",
  // },
  // fillInTheHoles: {
  //   name: "Fill In The Holes",
  //   premium: false,
  //   unlocked: true,
  //   price: "0.10",
  // },
  // mahjongBig: {
  //   name: "Mahjong Big",
  //   premium: false,
  //   unlocked: true,
  //   price: "0.10",
  // },
  // oneLineOnlyDTD: {
  //   name: "One Line Only",
  //   premium: false,
  //   unlocked: true,
  //   price: "0.10",
  // },
};
var usingPayPal = true; //false for no paypal
$(document).ready(function () {
  getParams();
  if (Object.keys(params).length !== 0) {
    for (var [key, value] of Object.entries(params)) {
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
  // $("#bricks").click(function () {
  //   if (gameDetails.bricks.unlocked == true) {
  //     location.href = "bricksBreaker/index.html";
  //   } else createPurchaseContainer($(this).attr("id"));
  // });

  $("#candy").click(function () {
    if (gameDetails.candy.unlocked == true) {
      // document.getElementById("newImage").style.visibility = hidden;
      // let count=1;
      location.href = "candyWorld/index.html";

    } else createPurchaseContainer($(this).attr("id"));
  });

  // $("#defenders").click(function () {
  //   if (gameDetails.defenders.unlocked == true) {
  //     location.href = "defenders/index.html";
  //   } else createPurchaseContainer($(this).attr("id"));
  // });

  // $("#hex").click(function () {
  //   if (gameDetails.hex.unlocked == true) {
  //     location.href = "hex/index.html";
  //   } else createPurchaseContainer($(this).attr("id"));
  // });

  $("#parking").click(function () {
    if (gameDetails.parking.unlocked == true) {
      location.href = "parkingPanic/index.html";
    } else createPurchaseContainer($(this).attr("id"));
  });

  // $("#parkingNew").click(function () {
  //   if (gameDetails.parking.unlocked == true) {
  //     location.href = "ExportedGames_ParkingPanic/index.html";
  //   } else createPurchaseContainer($(this).attr("id"));
  // });

  // $("#plumber").click(function () {
  //   if (gameDetails.plumber.unlocked == true) {
  //     location.href = "plumberWorld/index.html";
  //   } else createPurchaseContainer($(this).attr("id"));
  // });

  // $("#tangram").click(function () {
  //   if (gameDetails.tangram.unlocked == true) {
  //     location.href = "tangramPuzzle/index.html";
  //   } else createPurchaseContainer($(this).attr("id"));
  // });

  // $("#solitaire").click(function () {
  //   if (gameDetails.solitaire.unlocked == true) {
  //     location.href = "solitaireClassic/index.html";
  //   } else createPurchaseContainer($(this).attr("id"));
  // });

  // $("#sudoku").click(function () {
  //   if (gameDetails.sudoku.unlocked == true) {
  //     location.href = "sudoku/index.html";
  //   } else createPurchaseContainer($(this).attr("id"));
  // });
  // $("#TicTacToe").click(function () {
  //   if (gameDetails.ticTacToe.unlocked == true) {
  //     location.href = "ticTacToe/index.html";
  //   } else createPurchaseContainer($(this).attr("id"));
  // });
  // $("#petitsChevauxSH").click(function () {
  //   if (gameDetails.petitsChevauxSH.unlocked == true) {
  //     location.href = "petitsChevauxSH/index.html";
  //   } else createPurchaseContainer($(this).attr("id"));
  // });
  // $("#yatzyYahtzee").click(function () {
  //   if (gameDetails.yatzyYahtzee.unlocked == true) {
  //     location.href = "yatzyYahtzee/index.html";
  //   } else createPurchaseContainer($(this).attr("id"));
  // });

  // $("#ten").click(function () {
  //   if (gameDetails.ten.unlocked == true) {
  //     location.href = "tenXTen/index.html";
  //   } else createPurchaseContainer($(this).attr("id"));
  // });
  // $("#align4Big").click(function () {
  //   if (gameDetails.align4Big.unlocked == true) {
  //     location.href = "align4Big/index.html";
  //   } else createPurchaseContainer($(this).attr("id"));
  // });
  // $("#chooChooConnect").click(function () {
  //   if (gameDetails.chooChooConnect.unlocked == true) {
  //     location.href = "chooChooConnect/index.html";
  //   } else createPurchaseContainer($(this).attr("id"));
  // });
  // $("#fillInTheHoles").click(function () {
  //   if (gameDetails.fillInTheHoles.unlocked == true) {
  //     location.href = "fillInTheHoles/index.html";
  //   } else createPurchaseContainer($(this).attr("id"));
  // });
  // $("#mahjongBig").click(function () {
  //   if (gameDetails.mahjongBig.unlocked == true) {
  //     location.href = "mahjongBig/index.html";
  //   } else createPurchaseContainer($(this).attr("id"));
  // });
  // $("#oneLineOnlyDTD").click(function () {
  //   if (gameDetails.oneLineOnlyDTD.unlocked == true) {
  //     location.href = "oneLineOnlyDTD/index.html";
  //   } else createPurchaseContainer($(this).attr("id"));
  // });
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
      margin: "auto"
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
