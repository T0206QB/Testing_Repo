let driver_distraction = false;
top.LOCALIZATION_ID = "iconic_games";

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
  document.getElementById("ddmessage").textContent =
    top.locale["dd_games_message"];
  $(".flexcontainer").css("display", "none");
  $("#ddmessage").css("display", "flex");
}

function load_non_driver_distraction() {
  $("#ddmessage").css("display", "none");
  $(".flexcontainer").css("display", "flex");
}

window.addEventListener("translation_completed", () => {
  translatePage();
});

const translatePage = () => {
  try {
    document.querySelectorAll("[localization-key]").forEach((element) => {
      let key = element.getAttribute("localization-key");
      let translation = top.locale[key];
      if (translation == undefined)
        console.log("Games translation not defined for " + key);
      else element.innerText = translation;
    });
  } catch (err) {
    console.log("Exception while translating in games! " + err);
    top.locale = {};
  }
};

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
      var gameContainer = document.getElementById("gameContainer");
      if (data && data.apps && data.apps.length > 0) {
        document.getElementById("no_games_container").style.display = "none";

        data.apps.sort((a, b) => a.name.localeCompare(b.name));
        data.apps.forEach((game) => {
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
            sessionStorage.setItem("gameId", game.id);
            sessionStorage.setItem("gameName", game.name);
            top.stellaHandle.requestAudioFocus();
            var game_id  = game.id;
            var game_name = game.name;
            top.Analytics.track("appStart", {
              appId: game_id,
              appName: game_name,
            });
            location.href = `${gameNameId}` + "/index.html";
          });
          $("body").css("opacity", 100);
        });
      } else {
        console.log("EE games no data error", data);
        document.getElementById("gameContainer").style.display = "none";
        document.getElementById("no_games_container").style.display = "block";
        $("body").css("opacity", 100);
      }
    },
    (error) => {
      console.log("EE games API Error: ", error);
      document.getElementById("gameContainer").style.display = "none";
      document.getElementById("no_games_container").style.display = "block";
      $("body").css("opacity", 100);
    },
    {
      url: apiUrl,
      method: "GET",
    }
  );
});

// make captured games count zero when games page is loaded to dismiss the notification
window.onload = function () {
  top.stellaHandle.abandonAudioFocus();
  var app_ID = top.APPID;
  var app_name = top.APPNAME;
  var game_id = sessionStorage.getItem("gameId");
  var game_name = sessionStorage.getItem("gameName");
  if (game_name === null) {
    top.Analytics.track("appClose", {
      appId: app_ID,
      appName:app_name
    });
  } else {
    top.Analytics.track("appClose", {
      appId: game_id,
      appName: game_name,
    });
  }
  sessionStorage.removeItem("gameId");
  sessionStorage.removeItem("gameName");
  const savedAppInfo = JSON.parse(localStorage.getItem("appInfo"));
  const appId = top.APPID;
  if (savedAppInfo && appId && savedAppInfo[appId]) {
    const notification = savedAppInfo[appId].notification;
    if (notification !== 0) {
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
