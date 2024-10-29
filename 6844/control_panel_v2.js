// Load the saved orientation when the page loads
window.onload = function () {
  const savedOrientation = localStorage.getItem("orientation") || "portrait";
  const container = document.querySelector(".container");
  container.classList.add(savedOrientation);
  const savedControlLR =
    localStorage.getItem("control-l-r") || "controls-right";
  const controls = document.getElementById("controls");
  controls.classList.add(savedControlLR);
  hideShowGroundSpeedSP();
};

function bumpSetpoint(setPointItm, direction) {
  const chainModeGroundEnabled = document
    .getElementById("chainModeGround")
    .classList.contains("green");
  console.log(chainModeGroundEnabled);
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

// Toggle left/right control buttons and save the state
function toggleLR() {
  const container = document.getElementById("controls");
  if (container.classList.contains("controls-right")) {
    container.classList.remove("controls-right");
    container.classList.add("controls-left");
    localStorage.setItem("control-l-r", "controls-left");
  } else {
    container.classList.remove("controls-left");
    container.classList.add("controls-right");
    localStorage.setItem("control-l-r", "controls-right");
  }
}

// Toggle the orientation and save the state
function toggleOrientation() {
  const container = document.querySelector(".container");
  if (container.classList.contains("portrait")) {
    container.classList.remove("portrait");
    container.classList.add("landscape");
    localStorage.setItem("orientation", "landscape");
  } else {
    container.classList.remove("landscape");
    container.classList.add("portrait");
    localStorage.setItem("orientation", "portrait");
  }
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

function enableCameraMode(elem) {
	document.getElementById("statusCameraMode").classList.add("hide");
	document.getElementById("smallVideos").classList.remove('video');
	document.getElementById("smallVideos").classList.add("hide");
	document.getElementById("control-body").classList.add("hide");
	document.getElementById("presetSave").classList.add("hide");
	document.getElementById("tbpresetSave").classList.add("hide");
	document.getElementById("controls").classList.remove("controls-right");
	document.getElementById("showStatus").classList.remove("hide");
	document.getElementById("displayVideoMode").classList.remove("hide");
	document.getElementById("vidAll").classList.remove("hide");
  }

function toggleControl(elem) {
  disableCameraMode();
  document.getElementById("digger").classList.add("hide");
  document.getElementById("btnDigger").classList.remove("button-active");
  document.getElementById("chains").classList.add("hide");
  document.getElementById("btnChains").classList.remove("button-active");
  document.getElementById("table").classList.add("hide");
  document.getElementById("btnTable").classList.remove("button-active");
  document.getElementById("boom").classList.add("hide");
  document.getElementById("btnBoom").classList.remove("button-active");
  document.getElementById(elem).classList.remove("hide");
  document
    .getElementById("btn" + elem.charAt(0).toUpperCase() + elem.substr(1))
    .classList.add("button-active");
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
	document.getElementById("statusCameraMode").classList.remove("hide");
	document.getElementById("smallVideos").classList.add('video');
	document.getElementById("smallVideos").classList.remove("hide");
	document.getElementById("control-body").classList.remove("hide");
	document.getElementById("presetSave").classList.remove("hide");
	document.getElementById("tbpresetSave").classList.remove("hide");
	document.getElementById("controls").classList.add("controls-right");
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
