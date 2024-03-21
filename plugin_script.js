function getNotificationValue_iconic_games(app_details) {
  const appId = app_details.id;

  var notifyValue;


  try{
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
        var gamesCount = gamesAppInfo.notification || 0;
  
        const initVersionStr = `ver=${initialVers},`;
        const countString = featureFlagsNotification.split(initVersionStr)[1];
  
        countString.split(";").forEach((f, fIndex) => {
          if (f.includes("cnt=")) {
            const newCount = f.split("cnt=")[1];
            gamesCount += Number(newCount);
          }
        });
        const notificationCount = gamesCount;
        
        if (notificationCount) {
          notifyValue = notificationCount;
        }

        if((!isNaN(notificationCount) && notificationCount >= 1 && notificationCount < 50)){
          const appInfoValue = {
            ...savedAppInfo,
            [`${appId}`]: {
              version: incomingGamesLatestVersion,
              notification: notificationCount,
            },
          };
    
          localStorage.setItem("appInfo", JSON.stringify(appInfoValue));
        }
       
      } else if (gamesAppInfo.notification) {
        notifyValue = gamesAppInfo.notification;
      }
    }
  }
  
  catch(err) {
    console.log('Error occurred in computing notification', err);
  }

  return (!isNaN(notifyValue) && notifyValue >= 1 && notifyValue < 50) ? notifyValue : '';
}

