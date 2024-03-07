
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
  $("#c2canvasdiv").hide();
  $("#ddmessage").css("display", "flex");
  cr_setSuspended(true);
}

function load_non_driver_distraction() {
  $("#ddmessage").css("display", "none");
  $("#c2canvasdiv").show();
  cr_setSuspended(false);
}
