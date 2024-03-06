function getAppGrid(app_details) {
  const appId = app_details.id;
  const name = app_details.name;
  const line1 = app_details.name;
  let url = app_details.url;
  const image = app_details.srcImg;

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

  const featureFlagsNotification = app_details.featureFlags && app_details.featureFlags.notification;
  if (featureFlagsNotification) {
    const featureFlagArr = featureFlagsNotification.split(";") || [];
    const latestDetails = featureFlagArr[featureFlagArr.length - 1]
      ? featureFlagArr[featureFlagArr.length - 1]
      : featureFlagArr[featureFlagArr.length - 2];

    const incomingGamesLatestVersion = Number(
      latestDetails.split(",")[0].split("=")[1]
    );

    const savedAppInfo = JSON.parse(localStorage.getItem("appInfo")) || {};
    const gamesAppInfo = savedAppInfo.games || {};

    if (
      !gamesAppInfo.version ||
      gamesAppInfo.version < incomingGamesLatestVersion
    ) {
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

      countString.split(";").forEach((f, fIndex) => {
        if (f.includes("cnt=")) {
          const newCount = f.split("cnt=")[1];
          initialCount += Number(newCount);
        }
      });
      const notificationCount = initialCount;

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

  return divHTML1 + notifyHTML + divHTML2;
}

