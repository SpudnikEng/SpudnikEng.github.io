// Load the saved orientation when the page loads
window.onload = function () {
  hideShowGroundSpeedSP();
}

function bumpChainSetpoint(setPointItm, direction) {
  const chainModeGroundEnabled = document
    .getElementById("chainModeGround")
    .classList.contains("green");
  if (chainModeGroundEnabled) {
    setPointElem = document.getElementById(setPointItm + "Ground");
  } else {
    setPointElem = document.getElementById(setPointItm + "Fixed");
  }
  let currentValue = parseInt(setPointElem.value);
  if (isNaN(currentValue) || currentValue < 10) {
    currentValue = 10;
  }
  if (direction == "up") {
    setPointElem.value = currentValue + 10;
  } else {
    setPointElem.value = currentValue - 10;
  }
}

function bumpRollerSetpoint(setPointItm, direction) {
  setPointElem = document.getElementById(setPointItm);
  let currentValue = parseInt(setPointElem.value);
  if (isNaN(currentValue) || currentValue < 10) {
    currentValue = 10;
  }
  if (direction == "up") {
    setPointElem.value = currentValue + 10;
  } else {
    setPointElem.value = currentValue - 10;
  }
}

function bumpChainSetpointAll(direction) {
  bumpChainSetpoint('chainIntSP', direction);
  bumpChainSetpoint('chainPriSP', direction);
  bumpChainSetpoint('chainVineSP', direction);
  bumpChainSetpoint('chainSegmentSP', direction);
  bumpChainSetpoint('chainClodSP', direction);
  bumpChainSetpoint('chainSpreaderSP', direction);
  bumpChainSetpoint('chainRearCrossSP', direction);
  bumpChainSetpoint('chainSideElevSP', direction);
  bumpChainSetpoint('chainPilerSP', direction);
  bumpChainSetpoint('chainHoldTankSP', direction);
}

function bumpSetpoint(id, inc) {
  let setPointElem = document.getElementById(id);
  let currentValue = parseInt(setPointElem.value);
  if (isNaN(currentValue) || (currentValue < Math.abs(inc))) {
    //do nothing
  } else {
    setPointElem.value = currentValue + inc;
  }
}

function hideShowGroundSpeedSP() {
  var chainModeStatus = document.getElementById("chainModeGround");
  var collHide, collShow;
  if (chainModeStatus.classList.contains("green")) {
    //remove hide class from all inputs with speedGround and add to all inputs with speedFixed
    collHide = document.getElementsByClassName("speedFixed");
    collShow = document.getElementsByClassName("speedGround");
  } else {
    collShow = document.getElementsByClassName("speedFixed");
    collHide = document.getElementsByClassName("speedGround");
  }
  for (var i = 0; i < collShow.length; i++) {
    collShow[i].classList.remove("hide");
  }
  for (var i = 0; i < collHide.length; i++) {
    collHide[i].classList.add("hide");
  }
}

function setChainMode(mode) {
  if(mode=="Ground"){
    document.getElementById("chainModeGround").classList.add('green');
    document.getElementById("chainModeFixed").classList.remove('green');
  }
  else
  {
    document.getElementById("chainModeFixed").classList.add('green');
    document.getElementById("chainModeGround").classList.remove('green');
  }
  hideShowGroundSpeedSP();
}

function changeColorTimed(button) {
  const originalColor = button.style.backgroundColor;
  button.style.backgroundColor = "#72BB53";
  setTimeout(() => {
    button.style.backgroundColor = originalColor;
  }, 3000);
}

function toggleRUN(button) {
  var imgTags = document.getElementsByClassName("videoFeeds");
  var imgTagsM = document.getElementsByClassName("videoMed");
  var imgTagsL = document.getElementsByClassName("videoLarge");
  var newExt = "V.gif";
  var oldExt = "S.png";
  if (button.classList.contains("button-run")) {
    button.classList.remove("button-run");
    button.classList.add("button-run-active");
	document.getElementById('intakeFwd').classList.remove("button-active");
	document.getElementById('primaryFwd').classList.remove("button-active");
	document.getElementById('vineFwd').classList.remove("button-active");
	document.getElementById('tableFwd').classList.remove("button-active");
	document.getElementById('rearcrossFwd').classList.remove("button-active");
	document.getElementById('sideelevatorFwd').classList.remove("button-active");
	document.getElementById('pilerFwd').classList.remove("button-active");
	document.getElementById('bunkerFwd').classList.remove("button-active");
  } else {
    button.classList.remove("button-run-active");
    button.classList.add("button-run");
    newExt = "S.png";
    oldExt = "V.gif";
  }
  for (var i = 0; i < imgTags.length; i++) {
    imgTags[i].src = imgTags[i].src.replace(oldExt, newExt);
    imgTagsM[i].src = imgTagsM[i].src.replace(oldExt, newExt);
    imgTagsL[i].src = imgTagsL[i].src.replace(oldExt, newExt);
  }
}

function toggleButtonState(button) {
  if (button.classList.contains("button-active")) {
    button.classList.remove("button-active");
  } else {
    button.classList.add("button-active");
  }
}

function disableButton(btnId) {
	document.getElementById(btnId).classList.remove("button-active");
}

function togglePreset(button) {
  document.getElementById("preset1").classList.remove("button-active");
  document.getElementById("preset2").classList.remove("button-active");
  document.getElementById("preset3").classList.remove("button-active");
  button.classList.add("button-active");
}

function toggleCamera(elem) {
  document.getElementById("cameraAll").classList.add("hide");
  document.getElementById("camera1").classList.add("hide");
  document.getElementById("camera2").classList.add("hide");
  document.getElementById("camera3").classList.add("hide");
  document.getElementById("camera4").classList.add("hide");
  document.getElementById(elem).classList.remove("hide");
}

function deselectControlButtons() {
  document.getElementById("btnDigger").classList.remove("button-active");
  document.getElementById("btnChains").classList.remove("button-active");
  document.getElementById("btnTable").classList.remove("button-active");
  document.getElementById("btnBoom").classList.remove("button-active");
}

function hideControls() {
  document.getElementById("digger").classList.add("hide");
  document.getElementById("chains").classList.add("hide");
  document.getElementById("table").classList.add("hide");
  document.getElementById("boom").classList.add("hide");
}

function enableCameraMode(elem) {
  hideControls();
  deselectControlButtons();
  document.getElementById("control-buttons").style.width = "330px";
  document.getElementById("controls").style.height = "505px";
	document.getElementById("btnHome").classList.add("button-active");
	document.getElementById("smallVideos").classList.remove('video');
	document.getElementById("smallVideos").classList.add("hide");
	document.getElementById("presetSave").classList.add("hide");
	document.getElementById("tbpresetSave").classList.add("hide");
	document.getElementById("showStatus").classList.remove("hide");
	document.getElementById("displayVideoMode").classList.remove("hide");
	document.getElementById("vidAll").classList.remove("hide");
}

function toggleControl(id) {
  disableCameraMode();
  hideControls();
  deselectControlButtons();
  document.getElementById(id).classList.add("button-active");
  document.getElementById(id.toLowerCase().substr(3)).classList.remove('hide');
}

function openBottomSheet(elem) {
  document.getElementById("vid1").classList.add("hide");
  document.getElementById("vid2").classList.add("hide");
  document.getElementById("vid3").classList.add("hide");
  document.getElementById("vid4").classList.add("hide");
  document.getElementById("vidAll").classList.add("hide");
  document.getElementById(elem).classList.remove("hide");
  const bottomSheet = document.getElementById("bottomSheet");
  bottomSheet.classList.add("open");
}

function disableCameraMode() {
  document.getElementById("control-buttons").style.width = "100px";
  document.getElementById("controls").style.height = "auto";
	document.getElementById("btnHome").classList.remove("button-active");
	document.getElementById("smallVideos").classList.add('video');
	document.getElementById("smallVideos").classList.remove("hide");
	document.getElementById("presetSave").classList.remove("hide");
	document.getElementById("tbpresetSave").classList.remove("hide");
	document.getElementById("showStatus").classList.add("hide");
	document.getElementById("displayVideoMode").classList.add("hide");
	document.getElementById("vidAll").classList.add("hide");
}

function openModal(modalId) {
	console.log(modalId);
	document.getElementById(modalId).style.display = "flex";
}

function closeModal(modalId) {
	document.getElementById(modalId).style.display = "none";
}
