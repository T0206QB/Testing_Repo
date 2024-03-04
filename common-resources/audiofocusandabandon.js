//wait for VDA to load and request audio focus
window.setTimeout(function () {
  if (top.stellaHandle == null) {
    console.log("stella interface handle is null");
  } else {
    console.log("requesting audio focus");
    top.stellaHandle.requestAudioFocus();
  }
}, 1000);

//wait for VDA to load and abandon audio focus
window.onbeforeunload = function () {
  // VDAAndroid.stopMediaPlayer();
  if (top.stellaHandle == null) {
    console.log("failed to load stella handle");
    return;
  } else {
    console.log("abandon audio focus");
    top.stellaHandle.abandonAudioFocus();
  }
};
// Start the Construct 2 project running on window load.
jQuery(document).ready(function () {
  // Create new runtime using the c2canvas
  cr_createRuntime("c2canvas");
});

// Pause and resume on page becoming visible/invisible
function onVisibilityChanged() {
  if (
    document.hidden ||
    document.mozHidden ||
    document.webkitHidden ||
    document.msHidden
  )
    cr_setSuspended(true);
  else {
    if (top.stellaHandle == null) {
      console.log("stella interface handle is null");
    } else {
      console.log("requesting audio focus");
      top.stellaHandle.requestAudioFocus();
    }
    cr_setSuspended(false);
  }
  if(driver_distraction)
  cr_setSuspended(true);
}

document.addEventListener("visibilitychange", onVisibilityChanged, false);
document.addEventListener("mozvisibilitychange", onVisibilityChanged, false);
document.addEventListener("webkitvisibilitychange", onVisibilityChanged, false);
document.addEventListener("msvisibilitychange", onVisibilityChanged, false);

function OnRegisterSWError(e) {
  console.warn("Failed to register service worker: ", e);
}

// Runtime calls this global method when ready to start caching (i.e. after startup).
// This registers the service worker which caches resources for offline support.
window.C2_RegisterSW = function C2_RegisterSW() {
  if (!navigator.serviceWorker) return; // no SW support, ignore call

  try {
    navigator.serviceWorker
      .register("sw.js", { scope: "./" })
      .then(function (reg) {
        console.log("Registered service worker on " + reg.scope);
      })
      .catch(OnRegisterSWError);
  } catch (e) {
    OnRegisterSWError(e);
  }
};
