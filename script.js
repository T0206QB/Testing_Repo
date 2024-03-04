var gameDetails = {
  // woodenEdition2048: {
  //   name: "2048",
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
  // bricks: {
  //   name: "Bricks Breaker",
  //   premium: false,
  //   unlocked: true,
  //   price: "0.10",
  // },
  bubbleShooter: {
    name: "Bubble Shooter",
    premium: false,
    unlocked: true,
    price: "0.10",
  },
  bubbleShooter: {
    name: "Bubble Shooter1",
    premium: false,
    unlocked: true,
    price: "0.10",
  },
  candy: {
    name: "Candy World",
    premium: false,
    unlocked: true,
    price: "0.10",
  },
  candy: {
    name: "Candy World1",
    premium: false,
    unlocked: true,
    price: "0.10",
  },
  // chooChooConnect: {
  //   name: "Choo Choo Connect",
  //   premium: false,
  //   unlocked: true,
  //   price: "0.10",
  // },
  // dominoesBig: {
  //   name: "Dominoes Big",
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
  // gameOfGoose: {
  //   name: "Game Of Goose Classic Edition",
  //   premium: false,
  //   unlocked: true,
  //   price: "0.10",
  // },
  hex: {
    name: "Hex",
    premium: false,
    unlocked: true,
    price: "0.10",
  },
  hex: {
    name: "Hex1",
    premium: false,
    unlocked: true,
    price: "0.10",
  },
  // linkTheNumbers: {
  //   name: "Link The Numbers",
  //   premium: false,
  //   unlocked: true,
  //   price: "0.10",
  // },
  liquidPuzzle: {
    name: "Liquid Puzzle",
    premium: false,
    unlocked: true,
    price: "0.10",
  },
  liquidPuzzle: {
    name: "Liquid Puzzle1",
    premium: false,
    unlocked: true,
    price: "0.10",
  },
  // mahjongBig: {
  //   name: "Mahjong Big",
  //   premium: false,
  //   unlocked: true,
  //   price: "0.10",
  // },
  // mathGamesForAdults: {
  //   name: "Math Games For Adults",
  //   premium: false,
  //   unlocked: true,
  //   price: "0.10",
  // },
  oneLineOnly: {
    name: "One Line Only",
    premium: false,
    unlocked: true,
    price: "0.10",
  },
  oneLineOnly1: {
    name: "One Line Only Compressed",
    premium: false,
    unlocked: true,
    price: "0.10",
  },
  parking: {
    name: "Parking Panic",
    premium: false,
    unlocked: true,
    price: "0.10",
  },
  parking: {
    name: "Parking Panic1",
    premium: false,
    unlocked: true,
    price: "0.10",
  },
  petitsChevaux: {
    name: "Petits Chevaux",
    premium: false,
    unlocked: true,
    price: "0.10",
  },
  petitsChevaux1: {
    name: "Petits Chevaux1",
    premium: false,
    unlocked: true,
    price: "0.10",
  },
  plumber: {
    name: "Plumber World",
    premium: false,
    unlocked: true,
    price: "0.10",
  },
  plumber1: {
    name: "Plumber World Compressed",
    premium: false,
    unlocked: true,
    price: "0.10",
  },
  snakesAndLadders: {
    name: "Snakes And Ladders",
    premium: false,
    unlocked: true,
    price: "0.10",
  },
  snakesAndLadders1: {
    name: "Snakes And Ladders1",
    premium: false,
    unlocked: true,
    price: "0.10",
  },
  solitaire: {
    name: "Solitaire Classic",
    premium: false,
    unlocked: true,
    price: "0.10",
  },
  solitaire1: {
    name: "Solitaire Classic Compressed",
    premium: false,
    unlocked: true,
    price: "0.10",
  },
  sudoku: {
    name: "Sudoku",
    premium: false,
    unlocked: true,
    price: "0.10",
  },
  sudoku1: {
    name: "Sudoku1",
    premium: false,
    unlocked: true,
    price: "0.10",
  },
  tangram: {
    name: "Tangram Puzzle",
    premium: false,
    unlocked: true,
    price: "0.10",
  },
  tangram1: {
    name: "Tangram Puzzle Compressed",
    premium: false,
    unlocked: true,
    price: "0.10",
  },
  tenXTen: {
    name: "TenXTen",
    premium: false,
    unlocked: true,
    price: "0.10",
  },
  tenXTen1: {
    name: "tenXTen 1",
    premium: false,
    unlocked: true,
    price: "0.10",
  },
  theGame13: {
    name: "The Game 13",
    premium: false,
    unlocked: true,
    price: "0.10",
  },
  theGame13: {
    name: "The Game 13-1",
    premium: false,
    unlocked: true,
    price: "0.10",
  },
  ticTacToe: {
    name: "Tic Tac Toe",
    premium: false,
    unlocked: true,
    price: "0.10",
  },
  ticTacToe1: {
    name: "Tic Tac Toe 1",
    premium: false,
    unlocked: true,
    price: "0.10",
  },
  yatzyYahtzeeYams: {
    name: "Yatzy Yahtzee Yams",
    premium: false,
    unlocked: true,
    price: "0.10",
  },
  yatzyYahtzeeYams1: {
    name: "Yatzy Yahtzee Yams 1",
    premium: false,
    unlocked: true,
    price: "0.10",
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

  // $("#woodenEdition2048").click(function () {
  //   if (gameDetails.woodenEdition2048.unlocked == true) {
  //     location.href = "2048woodenEdition/index.html";
  //   } else createPurchaseContainer($(this).attr("id"));
  // });

  // $("#align4Big").click(function () {
  //   if (gameDetails.align4Big.unlocked == true) {
  //     location.href = "align4Big/index.html";
  //   } else createPurchaseContainer($(this).attr("id"));
  // });

  // $("#bricks").click(function () {
  //   if (gameDetails.bricks.unlocked == true) {
  //     location.href = "bricksBreaker/index.html";
  //   } else createPurchaseContainer($(this).attr("id"));
  // });

  $("#bubbleShooter").click(function () {
    if (gameDetails.bubbleShooter.unlocked == true) {
      location.href = "bubbleShooter/index.html";
      editSavedGamesList('bubbleShooter', 'old');
    } else createPurchaseContainer($(this).attr("id"));
  });
  $("#bubbleShooter1").click(function () {
    if (gameDetails.bubbleShooter1.unlocked == true) {
      location.href = "bubbleShooter1/index.html";
      editSavedGamesList('bubbleShooter1', 'old');
    } else createPurchaseContainer($(this).attr("id"));
  });
  $("#candy").click(function () {
    if (gameDetails.candy.unlocked == true) {
      editSavedGamesList('candy', 'old');
      location.href = "candyWorld/index.html";
    } else createPurchaseContainer($(this).attr("id"));
  });
  $("#candy1").click(function () {
    if (gameDetails.candy.unlocked == true) {
      editSavedGamesList('candy1', 'old');
      location.href = "candyWorld1/index.html";
    } else createPurchaseContainer($(this).attr("id"));
  });

  // $("#chooChooConnect").click(function () {
  //   if (gameDetails.chooChooConnect.unlocked == true) {
  //     location.href = "chooChooConnect/index.html";
  //   } else createPurchaseContainer($(this).attr("id"));
  // });

  // $("#dominoesBig").click(function () {
  //   if (gameDetails.dominoesBig.unlocked == true) {
  //     location.href = "dominoesBig/index.html";
  //   } else createPurchaseContainer($(this).attr("id"));
  // });

  // $("#fillInTheHoles").click(function () {
  //   if (gameDetails.fillInTheHoles.unlocked == true) {
  //     location.href = "fillInTheHoles/index.html";
  //   } else createPurchaseContainer($(this).attr("id"));
  // });
  // $("#gameOfGoose").click(function () {
  //   if (gameDetails.gameOfGoose.unlocked == true) {
  //     location.href = "gameOfGoose/index.html";
  //   } else createPurchaseContainer($(this).attr("id"));
  // });
  $("#hex").click(function () {
    if (gameDetails.hex.unlocked == true) {
      location.href = "hex/index.html";
      editSavedGamesList('hex', 'old');
    } else createPurchaseContainer($(this).attr("id"));
  });
  $("#hex1").click(function () {
    if (gameDetails.hex1.unlocked == true) {
      location.href = "hex1/index.html";
      editSavedGamesList('hex1', 'old');
    } else createPurchaseContainer($(this).attr("id"));
  });

  // $("#linkTheNumbers").click(function () {
  //   if (gameDetails.linkTheNumbers.unlocked == true) {
  //     location.href = "linkTheNumbers/index.html";
  //   } else createPurchaseContainer($(this).attr("id"));
  // });

  $("#liquidPuzzle").click(function () {
    if (gameDetails.liquidPuzzle.unlocked == true) {
      location.href = "liquidPuzzle/index.html";
      editSavedGamesList('liquidPuzzle', 'old');
    } else createPurchaseContainer($(this).attr("id"));
  });
  $("#liquidPuzzle1").click(function () {
    if (gameDetails.liquidPuzzle1.unlocked == true) {
      location.href = "liquidPuzzle1/index.html";
      editSavedGamesList('liquidPuzzle1', 'old');
    } else createPurchaseContainer($(this).attr("id"));
  });
  // $("#mahjongBig").click(function () {
  //   if (gameDetails.mahjongBig.unlocked == true) {
  //     location.href = "mahjongBig/index.html";
  //   } else createPurchaseContainer($(this).attr("id"));
  // });

  // $("#mathGamesForAdults").click(function () {
  //   if (gameDetails.mathGamesForAdults.unlocked == true) {
  //     location.href = "mathGamesForAdults/index.html";
  //   } else createPurchaseContainer($(this).attr("id"));
  // });

  $("#oneLineOnly").click(function () {
    if (gameDetails.oneLineOnly.unlocked == true) {
      location.href = "oneLineOnly/index.html";
      editSavedGamesList('oneLineOnly', 'old');
    } else createPurchaseContainer($(this).attr("id"));
  });

  $("#oneLineOnly1").click(function () {
    if (gameDetails.oneLineOnly1.unlocked == true) {
      location.href = "oneLineOnly1/index.html";
      editSavedGamesList('oneLineOnly1', 'old');
    } else createPurchaseContainer($(this).attr("id"));
  });

  $("#parking").click(function () {
    if (gameDetails.parking.unlocked == true) {
      location.href = "parkingPanic/index.html";
      editSavedGamesList('parking', 'old');
    } else createPurchaseContainer($(this).attr("id"));
  });
  $("#parking1").click(function () {
    if (gameDetails.parking1.unlocked == true) {
      location.href = "parkingPanic1/index.html";
      editSavedGamesList('parking1', 'old');
    } else createPurchaseContainer($(this).attr("id"));
  });
  $("#petitsChevaux").click(function () {
    if (gameDetails.petitsChevaux.unlocked == true) {
      location.href = "petitsChevaux/index.html";
      editSavedGamesList('petitsChevaux', 'old');
    } else createPurchaseContainer($(this).attr("id"));
  });

  $("#petitsChevaux1").click(function () {
    if (gameDetails.petitsChevaux1.unlocked == true) {
      location.href = "petitsChevaux1/index.html";
      editSavedGamesList('petitsChevaux1', 'old');
    } else createPurchaseContainer($(this).attr("id"));
  });

  $("#plumber").click(function () {
    if (gameDetails.plumber.unlocked == true) {
      location.href = "plumberWorld/index.html";
      editSavedGamesList('plumberWorld', 'old');
    } else createPurchaseContainer($(this).attr("id"));
  });

  $("#plumber1").click(function () {
    if (gameDetails.plumber1.unlocked == true) {
      location.href = "plumberWorld1/index.html";
      editSavedGamesList('plumberWorld1', 'old');
    } else createPurchaseContainer($(this).attr("id"));
  });
  
  $("#snakesAndLadders").click(function () {
    if (gameDetails.snakesAndLadders.unlocked == true) {
      location.href = "snakesAndLadders/index.html";
      editSavedGamesList('snakesAndLadders', 'old');
    } else createPurchaseContainer($(this).attr("id"));
  });

  $("#snakesAndLadders1").click(function () {
    if (gameDetails.snakesAndLadders1.unlocked == true) {
      location.href = "snakesAndLadders1/index.html";
      editSavedGamesList('snakesAndLadders1', 'old');
    } else createPurchaseContainer($(this).attr("id"));
  });

  $("#solitaire").click(function () {
    if (gameDetails.solitaire.unlocked == true) {
      location.href = "solitaireClassic/index.html";
      editSavedGamesList('solitaireClassic', 'old');
    } else createPurchaseContainer($(this).attr("id"));
  });
  
  $("#solitaire1").click(function () {
    if (gameDetails.solitaire.unlocked == true) {
      location.href = "solitaireClassic1/index.html";
      editSavedGamesList('solitaireClassic1', 'old');
    } else createPurchaseContainer($(this).attr("id"));
  });

  $("#sudoku").click(function () {
    if (gameDetails.sudoku.unlocked == true) {
      location.href = "sudoku/index.html";
      editSavedGamesList('sudoku', 'old');
    } else createPurchaseContainer($(this).attr("id"));
  });
  $("#sudoku1").click(function () {
    if (gameDetails.sudoku1.unlocked == true) {
      location.href = "sudoku1/index.html";
      editSavedGamesList('sudoku1', 'old');
    } else createPurchaseContainer($(this).attr("id"));
  });
  $("#tangram").click(function () {
    if (gameDetails.tangram.unlocked == true) {
      location.href = "tangramPuzzle/index.html";
      editSavedGamesList('tangram', 'old');
    } else createPurchaseContainer($(this).attr("id"));
  });
  $("#tangram1").click(function () {
    if (gameDetails.tangram1.unlocked == true) {
      location.href = "tangramPuzzle1/index.html";
      editSavedGamesList('tangram1', 'old');
    } else createPurchaseContainer($(this).attr("id"));
  });

  $("#tenXTen").click(function () {
    if (gameDetails.tenXTen.unlocked == true) {
      location.href = "tenXTen/index.html";
      editSavedGamesList('tenXTen', 'old');
    } else createPurchaseContainer($(this).attr("id"));
  });
  $("#tenXTen1").click(function () {
    if (gameDetails.tenXTen1.unlocked == true) {
      location.href = "tenXTen1/index.html";
      editSavedGamesList('tenXTen1', 'old');
    } else createPurchaseContainer($(this).attr("id"));
  });
  $("#theGame13").click(function () {
    if (gameDetails.theGame13.unlocked == true) {
      location.href = "theGame13/index.html";
      editSavedGamesList('theGame13', 'old');
    } else createPurchaseContainer($(this).attr("id"));
  });
  $("#theGame13-1").click(function () {
    if (gameDetails['theGame13-1'].unlocked == true) {
      location.href = "theGame13-1/index.html";
      editSavedGamesList('theGame13-1', 'old');
    } else createPurchaseContainer($(this).attr("id"));
  });
  $("#ticTacToe").click(function () {
    if (gameDetails.ticTacToe.unlocked == true) {
      location.href = "ticTacToe/index.html";
      editSavedGamesList('ticTacToe', 'old');
    } else createPurchaseContainer($(this).attr("id"));
  });
  $("#ticTacToe1").click(function () {
    if (gameDetails.ticTacToe1.unlocked == true) {
      location.href = "ticTacToe1/index.html";
      editSavedGamesList('ticTacToe1', 'old');
    } else createPurchaseContainer($(this).attr("id"));
  });

  $("#yatzyYahtzeeYams").click(function () {
    if (gameDetails.yatzyYahtzeeYams.unlocked == true) {
      location.href = "yatzyYahtzeeYams/index.html";
      editSavedGamesList('yatzyYahtzeeYams', 'old');
    } else createPurchaseContainer($(this).attr("id"));
  });
  $("#yatzyYahtzeeYams1").click(function () {
    if (gameDetails.yatzyYahtzeeYams1.unlocked == true) {
      location.href = "yatzyYahtzeeYams1/index.html";
      editSavedGamesList('yatzyYahtzeeYams1', 'old');
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


window.onload = function () {
  const savedAppInfo = JSON.parse(localStorage.getItem("appInfo")) || {};
  const notification = savedAppInfo.games && savedAppInfo.games.notification;
  if (notification !== 0) {
    // turn game notification count to zero
    const editedAppInfoValue = {
      ...savedAppInfo,
      games: { 
              ...savedAppInfo.games,
              notification: 0
             }
    };
    localStorage.setItem("appInfo", JSON.stringify(editedAppInfoValue));
  }
}