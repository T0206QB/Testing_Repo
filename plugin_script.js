function getAppGrid(app_details) {
  console.log("app_details inside game", app_details);
  const appId = app_details.id;
  const name = app_details.name;
  const line1 = app_details.name;
  let url = app_details.url;
  const image = app_details.srcImg;

  var appGrid = "";
  var notifyHTML = ``;

  var divHTML1 = `<div class="appIcon">
    <a class="simple_link" onclick="setTitle('${name}', '${url}', '${appId}');">
    <div class="appimg">
      <img id="${appId}" class="appimgdata" src="images/${image}" alt="app">`;

  var divHTML2 = `</div>
    <div class="${appId} ds-app-text" id="iconTitle">
      ${line1}
    </div>
    </a>
  </div>`;

  console.log("game feature flags", appId, app_details.featureFlags);
  const featureFlagsNotification = app_details.featureFlags && app_details.featureFlags.notification;
  if(featureFlagsNotification){
    const featureFlagArr = featureFlagsNotification.split(";") || [];
    console.log("featureFlagArr", featureFlagsNotification, featureFlagArr);
    const latestDetails = featureFlagArr[featureFlagArr.length - 1]
      ? featureFlagArr[featureFlagArr.length - 1]
      : featureFlagArr[featureFlagArr.length - 2];
    console.log("games latestDetails", latestDetails);
  
    const incomingGamesLatestVersion = Number(
      latestDetails.split(",")[0].split("=")[1]
    );
    console.log("games latest version from EE", incomingGamesLatestVersion);
  
    const savedAppInfo = JSON.parse(localStorage.getItem("appInfo")) || {};
    const gamesAppInfo = savedAppInfo.games || {};
    console.log("local storage gamesAppInfo", gamesAppInfo);
  
    if (
      !gamesAppInfo.version ||
      gamesAppInfo.version < incomingGamesLatestVersion
    ) {
      console.log("initial version", !gamesAppInfo.version);
      const initialVers = !gamesAppInfo.version
        ? Number(
            featureFlagsNotification.substring(
              featureFlagsNotification.indexOf("ver=") + 4,
              featureFlagsNotification.indexOf(",")
            )
          )
        : gamesAppInfo.version + 1;
      var initialCount = gamesAppInfo.notification || 0;
  
      const initVersionStr = `ver=${initialVers},`;
      const countString = featureFlagsNotification.split(initVersionStr)[1];
      console.log("count string", initialCount, countString);
  
      countString.split(";").forEach((f, fIndex) => {
        if (f.includes("cnt=")) {
          const newCount = f.split("cnt=")[1];
          initialCount += Number(newCount);
        }
      });
      const notificationCount = initialCount;
      console.log("games notification count", notificationCount);
  
      const appInfoValue = {
        games: {
          version: incomingGamesLatestVersion,
          notification: notificationCount,
        },
      };
      if (notificationCount) {
        notifyHTML = `<span id="app-notification">${notificationCount}</span>`;
      }
  
      localStorage.setItem("appInfo", JSON.stringify(appInfoValue));
    } else if (gamesAppInfo.notification) {
      notifyHTML = `<span id="app-notification">${gamesAppInfo.notification}</span>`;
    }
  }
 
  appGrid = divHTML1 + notifyHTML + divHTML2;

  return appGrid;
}

