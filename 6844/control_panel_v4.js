// Load the saved orientation when the page loads
window.onload = function () {
  hideShowGroundSpeedSP();
};

function bumpChainSetpoint(setPointItm, direction) {
   if (document.querySelector('.groundMode').classList.contains('green')) {
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
  setPointElem2 = document.getElementById(setPointItm+'2');
  let currentValue = parseInt(setPointElem.value);
  if (isNaN(currentValue) || currentValue < 10) {
    currentValue = 10;
  }
  if (direction == "up") {
    setPointElem.value = currentValue + 10;
    setPointElem2.value = currentValue + 10;
  } else {
    setPointElem.value = currentValue - 10;
    setPointElem2.value = currentValue - 10;
  }
}

function bumpChainSetpointAll(direction) {
  //chains only; no change to clod/spreader/segment roller speeds
  bumpChainSetpoint("chainIntSP", direction);
  bumpChainSetpoint("chainPriSP", direction);
  bumpChainSetpoint("chainVineSP", direction);
  bumpChainSetpoint("chainRearCrossSP", direction);
  bumpChainSetpoint("chainSideElevSP", direction);
  bumpChainSetpoint("chainPilerSP", direction);
  bumpChainSetpoint("chainHoldTankSP", direction);
}

function bumpSetpoint(id, inc) {
  let setPointElem = document.getElementById(id);
  let currentValue = parseInt(setPointElem.value);
  if (isNaN(currentValue) || ((currentValue <= Math.abs(inc)) && (inc < 0))) {
    //do nothing
  } else {
    setPointElem.value = currentValue + inc;
  }
}

function hideShowGroundSpeedSP() {
  if (document.querySelector('.groundMode').classList.contains('green')) {
    toggleObjectClass("speedFixed", "speedGround", "hide");
  } else {
    toggleObjectClass("speedGround", "speedFixed", "hide");
  }
}

function setChainMode(mode) {
  if (mode == "Ground") {
    toggleObjectClass("groundMode", "fixedMode", "green");
  } else {
    toggleObjectClass("fixedMode", "groundMode", "green");
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

function toggleRUN() {
  button = document.getElementById("run-button");
  var newExt = "V.gif";
  var oldExt = "S.png";
  if (button.classList.contains("button-run")) {
    button.classList.remove("button-run");
    button.classList.add("button-run-active");
    document.getElementById("intakeFwd").classList.remove("button-active");
    document.getElementById("primaryFwd").classList.remove("button-active");
    document.getElementById("vineFwd").classList.remove("button-active");
    document.getElementById("clodFwd").classList.remove("button-active");
    document.getElementById("segmentFwd").classList.remove("button-active");
    document.getElementById("spreaderFwd").classList.remove("button-active");
    document.getElementById("rearcrossFwd").classList.remove("button-active");
    document.getElementById("sideelevatorFwd").classList.remove("button-active");
    document.getElementById("pilerFwd").classList.remove("button-active");
    document.getElementById("bunkerFwd").classList.remove("button-active");
    toggleObjectClass("chains-override", "chains-speed", "hide");
  } else {
    toggleObjectClass("chains-speed", "chains-override", "hide");
    button.classList.remove("button-run-active");
    button.classList.add("button-run");
    newExt = "S.png";
    oldExt = "V.gif";
  }
  var imgTags = document.getElementsByClassName("videoFeeds");
  var imgTagsM = document.getElementsByClassName("videoMed");
  var imgTagsL = document.getElementsByClassName("videoLarge");
  for (var i = 0; i < imgTags.length; i++) {
    imgTags[i].src = imgTags[i].src.replace(oldExt, newExt);
    imgTagsM[i].src = imgTagsM[i].src.replace(oldExt, newExt);
    imgTagsL[i].src = imgTagsL[i].src.replace(oldExt, newExt);
  }
}

function toggleButtonState(button) {
  if (button.classList.contains("button-active")) {
    button.classList.remove("button-active");
    if (button.id == "coulterSync") {
      document.querySelectorAll(".syncBars").forEach(element => {
        element.classList.add("hide");
      });
    }
    if (button.id == "depthWheelsSync") {
      document.querySelectorAll(".syncBarsDepthWheels").forEach(element => {
        element.classList.add("hide");
      });
    }
  } else {
    button.classList.add("button-active");
    if (button.id == "coulterSync") {
      document.querySelectorAll(".syncBars").forEach(element => {
        element.classList.remove("hide");
      });
    }
    if (button.id == "depthWheelsSync") {
      document.querySelectorAll(".syncBarsDepthWheels").forEach(element => {
        element.classList.remove("hide");
      });
    }
  }
}

function disableButton(btnId) {
  document.getElementById(btnId).classList.remove("button-active");
}

function togglePreset(button) {
  if (button.id.includes("tb")) {
    document.getElementById("tbpreset1").classList.remove("button-active");
    document.getElementById("tbpreset2").classList.remove("button-active");
    document.getElementById("tbpreset3").classList.remove("button-active");
  } else {
    document.getElementById("preset1").classList.remove("button-active");
    document.getElementById("preset2").classList.remove("button-active");
    document.getElementById("preset3").classList.remove("button-active");
  }
  button.classList.add("button-active");
}

function deselectControlButtons() {
  document.getElementById("btnDigger").classList.remove("button-active");
  document.getElementById("btnChains").classList.remove("button-active");
  document.getElementById("btnTable").classList.remove("button-active");
  document.getElementById("btnBoom").classList.remove("button-active");
}

function hideControlBody() {
  document.getElementById("control-body").classList.add("hide");
}

function hideAllControls() {
  document.getElementById("digger").classList.add("hide");
  document.getElementById("chains").classList.add("hide");
  document.getElementById("table").classList.add("hide");
  document.getElementById("boom").classList.add("hide");
}

function showHomePage(elem) {
  hideControlBody();
  deselectControlButtons();
  document.getElementById("controls").style.height = "505px";
  document.getElementById("preset-buttons").style.float = "left";
  document.getElementById("btnHome").classList.add("button-active");
  document.getElementById("smallVideos").classList.remove("video");
  document.getElementById("smallVideos").classList.add("hide");
  document.getElementById("presetSave").classList.add("hide");
  document.getElementById("tbpresetSave").classList.add("hide");
  document.getElementById("showStatus").classList.remove("hide");
  document.getElementById("shakerControl").classList.remove("hide");
  document.getElementById("displayVideoMode").classList.remove("hide");
  document.getElementById("vidAll").classList.remove("hide");
}

function hideHomePage() {
  document.getElementById("controls").style.height = "auto";
  document.getElementById("preset-buttons").style.float = "right";
  document.getElementById("btnHome").classList.remove("button-active");
  document.getElementById("smallVideos").classList.add("video");
  document.getElementById("smallVideos").classList.remove("hide");
  document.getElementById("presetSave").classList.remove("hide");
  document.getElementById("tbpresetSave").classList.remove("hide");
  document.getElementById("control-body").classList.remove("hide");
  document.getElementById("showStatus").classList.add("hide");
  document.getElementById("shakerControl").classList.add("hide");
  document.getElementById("displayVideoMode").classList.add("hide");
  document.getElementById("vidAll").classList.add("hide");
}

function toggleControl(id) {
  hideHomePage();
  hideAllControls();
  deselectControlButtons();
  document.getElementById(id).classList.add("button-active");
  document.getElementById(id.toLowerCase().substr(3)).classList.remove("hide");
}

function openBottomSheet(elem) {
  // TO-DO remove this? Not sure what the image behavior should be...
  return;
  document.getElementById("vid1").classList.add("hide");
  document.getElementById("vid2").classList.add("hide");
  document.getElementById("vid3").classList.add("hide");
  document.getElementById("vid4").classList.add("hide");
  document.getElementById("vidAll").classList.add("hide");
  document.getElementById(elem).classList.remove("hide");
  const bottomSheet = document.getElementById("bottomSheet");
  bottomSheet.classList.add("open");
}

function toggleObjectClass(activeButtonClass, inactiveButtonClass, targetClass) {
  document.querySelectorAll("."+activeButtonClass).forEach((element) => {
    element.classList.add(targetClass);
  });
  document.querySelectorAll("."+inactiveButtonClass).forEach((element) => {
    element.classList.remove(targetClass);
  });
}

function toggleHomeVideos(objectId) {
  console.log(objectId);
  if(objectId == 'videoGridView') {
    document.querySelectorAll(".videoHome").forEach((element) => {
      element.classList.remove("hide");
      element.classList.remove("videoLarge");
      element.classList.add("videoMed");
    });
    document.getElementById('videoGridView').classList.add('hide');
  } else {
    document.querySelectorAll(".videoHome").forEach((element) => {
      element.classList.add("hide");
    });
    document.getElementById(objectId).classList.remove('videoMed');
    document.getElementById(objectId).classList.add('videoLarge');
    document.getElementById(objectId).classList.remove('hide');
    document.getElementById('videoGridView').classList.remove('hide');
  }
}

function openModal(modalId) {
  console.log(modalId);
  document.getElementById(modalId).style.display = "flex";
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}


function assignClickListeners(){
	document.querySelectorAll(".cleanMode").forEach(element => {
    element.addEventListener('click', () => toggleObjectClass("cleanMode", "transportMode", "green"));
	});
  document.querySelectorAll(".transportMode").forEach(element => {
    element.addEventListener('click', () => toggleObjectClass("transportMode", "cleanMode", "green"));
	});
  document.querySelectorAll(".fixedMode").forEach(element => {
    element.addEventListener('click', () => setChainMode('Fixed'));
	});
  document.querySelectorAll(".groundMode").forEach(element => {
    element.addEventListener('click', () => setChainMode('Ground'));
	});

  document.querySelectorAll(".videoHome").forEach(element => {
    element.addEventListener('click', () => toggleHomeVideos(element.id));
	});

  document.getElementById('videoGridView').addEventListener('click', () => toggleHomeVideos('videoGridView'));
  document.getElementById('smallVideos').addEventListener('click', () => showHomePage());
  document.getElementById('btnHome').addEventListener('click', () => showHomePage());
}

