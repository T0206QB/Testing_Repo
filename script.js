let driver_distraction = false;
window.addEventListener("driver_distraction", () => {
  console.log(`driver_distraction ${driver_distraction}`);
  if (driver_distraction) {
    return;
  }
  driver_distraction = true;
  load_driver_distraction();
});

window.addEventListener("no_driver_distraction", () => {
  console.log(`no_driver_distraction ${driver_distraction}`);
  if (!driver_distraction) {
    return;
  }
  driver_distraction = false;
  load_non_driver_distraction();
});

function load_driver_distraction() {
  $("#gameContainer").hide();
  $("#ddmessage").css("display", "flex");
}

function load_non_driver_distraction() {
  $("#ddmessage").css("display", "none");
  $("#gameContainer").show();
}
var gameDetails;
var games = [];
$(document).ready(function () {
  const baseUrl = top.stellaHandle.getProperty("eligibility_engine_url");
  const vin = top.stellaHandle.getVehicleIdentity();
  const country = top.stellaHandle.getCountryCode();
  const device = top.stellaHandle.getPlatformVersion();
  const brand = top.stellaHandle.getBrandInt();
  const parent = top.APPID;
  const apiUrl = `${baseUrl}?vin=${vin}&country=${country}&device=${device}&brand=${brand}&parent=${parent}`;

  top.makeAPIRequest(
    (data) => {
      games.push(data);
      games[0].apps.sort((a, b) => a.name.localeCompare(b.name));
      var gameContainer = document.getElementById("gameContainer");

      games[0].apps.forEach((game) => {
        var gameDiv = document.createElement("div");
        gameDiv.id = game.id;
        gameDiv.className = "gameApp";

        var gameDivHTML1 = `
                <div class="gameimg">
                  <img src="${game.srcImg}" class="icon" />
                  <img src="../images/premium-256.png" class="overlay" />`;

        var gameDivHTML2 = `</div>
                  <div class="gamename">${game.name}</div>`;
        gameDiv.innerHTML = gameDivHTML1 + gameDivHTML2;
        gameContainer.appendChild(gameDiv);
        var gameNameId = game.url.split("/")[2];
        $("#" + `${game.id}`).click(function () {
          var app_ID = top.APPID;
          top.Analytics.track("clickApp", {
            parentId: app_ID,
            gameId:game.id
         });
          location.href = `${gameNameId}` + "/index.html";
        });
        $("body").css("opacity", 100);
      });
    },
    (error) => {
      console.log("Error: ", error);
    },
    {
      url: apiUrl,
      method: "GET",
    }
  );
});

// add analytics
window.onload = function () {
  const savedAppInfo = JSON.parse(localStorage.getItem("appInfo"));
  const appId = top.APPID;
  if (savedAppInfo && appId && savedAppInfo[appId]) {
    const notifyValue = savedAppInfo[appId].notification;
    if (!isNaN(notifyValue) && notifyValue >= 1 && notifyValue <= 26) {
      const editedAppInfoValue = {
        ...savedAppInfo,
        [`${appId}`]: {
          ...savedAppInfo[appId],
          notification: 0,
        },
      };
      localStorage.setItem("appInfo", JSON.stringify(editedAppInfoValue));
    }
  }
};
