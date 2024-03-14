function getNotificationValue(app_details) {
  const appId = app_details.id;

  var notifyValue;


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
    const gamesAppInfo = savedAppInfo[appId] || {};

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
        ...savedAppInfo,
        [`${appId}`]: {
          version: incomingGamesLatestVersion,
          notification: notificationCount,
        },
      };
      if (notificationCount) {
        notifyValue = notificationCount;
      }

      localStorage.setItem("appInfo", JSON.stringify(appInfoValue));
    } else if (gamesAppInfo.notification) {
      notifyValue = gamesAppInfo.notification;
    }
  }

  return notifyValue;
}

