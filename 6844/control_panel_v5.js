// Load the saved orientation when the page loads
window.onload = function () {
  hideShowGroundSpeedSP();
};

function bumpChainSetpoint(setPointItm, direction) {
  if (document.querySelector(".groundMode").classList.contains("green")) {
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
  setPointElem2 = document.getElementById(setPointItm + "2");
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

function bumpSetpoint(id, inc, attr) {
  const barContainer = document.getElementById('barGraph-'+id);
  let currentValue = parseInt(barContainer.getAttribute(attr), 10);
  if (isNaN(currentValue)) {
    //do nothing
  } else {
	if(inc < 0) {
		currentValue = Math.max(currentValue+inc, 0);	//clamp to min 0
	} else {
		currentValue = Math.min(currentValue+inc, 100);	//clamp to max 100
	}
	barContainer.setAttribute(attr, currentValue);
	updateBarGraphs();
  }
}

function hideShowGroundSpeedSP() {
  if (document.querySelector(".groundMode").classList.contains("green")) {
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
  if(originalColor == "#72BB53") {
	//ignore extra click while background is green
  } else {
	button.style.backgroundColor = "#72BB53";
	setTimeout(() => {
	  button.style.backgroundColor = originalColor;
	}, 3000);
  }
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
    document
      .getElementById("sideelevatorFwd")
      .classList.remove("button-active");
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

// LocalStorage helper functions
const saveStatus = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};

const getStatus = (key) => {
    const status = localStorage.getItem(key);
    return status ? JSON.parse(status) : null;
};

function toggleAutoState(buttonFunction){
	const autoState = getStatus('autoStatus');
	console.log(autoState);
	autoState[buttonFunction] = !autoState[buttonFunction];
	for (const [key, value] of Object.entries(autoState)) {
		console.log(key, value);
        const buttonCollection = document.getElementsByClassName(key+'Auto');
		console.log(buttonCollection);
		Array.from(buttonCollection).forEach((button) => {
			if(value){
				button.classList.add('green');
			} else {
				button.classList.remove('green');
			}
		})
    }
	saveStatus('autoStatus', autoState);
}

function toggleButtonState(button) {
  if (button.classList.contains("button-active")) {
    button.classList.remove("button-active");
    if (button.id == "coulterSync") {
      document.querySelectorAll(".syncBars").forEach((element) => {
        element.classList.add("hide");
      });
    }
    if (button.id == "depthWheelsSync") {
      document.querySelectorAll(".syncBarsDepthWheels").forEach((element) => {
        element.classList.add("hide");
      });
    }
  } else {
    button.classList.add("button-active");
    if (button.id == "coulterSync") {
      document.querySelectorAll(".syncBars").forEach((element) => {
        element.classList.remove("hide");
      });
    }
    if (button.id == "depthWheelsSync") {
      document.querySelectorAll(".syncBarsDepthWheels").forEach((element) => {
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
  document.getElementById("btnAxle").classList.remove("button-active");
}

function hideControlBody() {
  document.getElementById("control-body").classList.add("hide");
}

function hideAllControls() {
  document.getElementById("digger").classList.add("hide");
  document.getElementById("chains").classList.add("hide");
  document.getElementById("table").classList.add("hide");
  document.getElementById("boom").classList.add("hide");
  document.getElementById("axle").classList.add("hide");
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
  document.getElementById("autoControl").classList.remove("hide");
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
  document.getElementById("autoControl").classList.add("hide");
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

function toggleObjectClass(
  activeButtonClass,
  inactiveButtonClass,
  targetClass
) {
  document.querySelectorAll("." + activeButtonClass).forEach((element) => {
    element.classList.add(targetClass);
  });
  document.querySelectorAll("." + inactiveButtonClass).forEach((element) => {
    element.classList.remove(targetClass);
  });
}

function toggleHomeVideos(objectId) {
  const CLASS_HIDE = "hide";
  const CLASS_VIDEO_LARGE = "videoLarge";
  const CLASS_VIDEO_MED = "videoMed";
  const videoElements = {
    topLeft: document.getElementById("topLeft"),
    topRight: document.getElementById("topRight"),
    bottomLeft: document.getElementById("bottomLeft"),
    bottomRight: document.getElementById("bottomRight"),
  };

  const controlElements = {
    videoGridView: document.getElementById("videoGridView"),
    videoPrevView: document.getElementById("videoPrevView"),
    videoNextView: document.getElementById("videoNextView"),
  };

  const videoKeys = ["topLeft", "topRight", "bottomLeft", "bottomRight"];

  // Logging for debugging purposes
  console.log(objectId);

  // Handle different views
  switch (objectId) {
    case "videoGridView":
      document.querySelectorAll(".videoHome").forEach((element) => {
        element.classList.remove(CLASS_HIDE, CLASS_VIDEO_LARGE);
        element.classList.add(CLASS_VIDEO_MED);
      });
      Object.values(controlElements).forEach((el) =>
        el.classList.add(CLASS_HIDE)
      );
      break;

    case "videoPrevView":
      for (let i = 0; i < videoKeys.length; i++) {
        const current = videoElements[videoKeys[i]];
        const next = videoElements[videoKeys[(i + 3) % 4]]; // Previous element in circular order
        if (!current.classList.contains(CLASS_HIDE)) {
          current.classList.add(CLASS_HIDE);
          next.classList.remove(CLASS_HIDE, CLASS_VIDEO_MED);
          next.classList.add(CLASS_VIDEO_LARGE);
          break;
        }
      }
      break;

    case "videoNextView":
		for (let i = 0; i < videoKeys.length; i++) {
		  const current = videoElements[videoKeys[i]];
		  const next = videoElements[videoKeys[(i + 1) % 4]]; // Next element in circular order
		  if (!current.classList.contains(CLASS_HIDE)) {
			current.classList.add(CLASS_HIDE);
			next.classList.remove(CLASS_HIDE, CLASS_VIDEO_MED);
			next.classList.add(CLASS_VIDEO_LARGE);
			break;
		  }
		}
      break;

    default:
      // Handle individual video selection
      document.querySelectorAll(".videoHome").forEach((element) => {
        element.classList.add(CLASS_HIDE);
      });
      const selectedVideo = document.getElementById(objectId);
      if (selectedVideo) {
        selectedVideo.classList.remove(CLASS_HIDE, CLASS_VIDEO_MED);
        selectedVideo.classList.add(CLASS_VIDEO_LARGE);
      }
      Object.values(controlElements).forEach((el) =>
        el.classList.remove(CLASS_HIDE)
      );
      break;
  }
}

function openModal(modalId) {
  console.log(modalId);
  document.getElementById(modalId).style.display = "flex";
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

function assignClickListeners() {
  document.querySelectorAll(".cleanMode").forEach((element) => {
    element.addEventListener("click", () =>
      toggleObjectClass("cleanMode", "transportMode", "green")
    );
  });
  document.querySelectorAll(".transportMode").forEach((element) => {
    element.addEventListener("click", () =>
      toggleObjectClass("transportMode", "cleanMode", "green")
    );
  });
  document.querySelectorAll(".fixedMode").forEach((element) => {
    element.addEventListener("click", () => setChainMode("Fixed"));
  });
  document.querySelectorAll(".groundMode").forEach((element) => {
    element.addEventListener("click", () => setChainMode("Ground"));
  });

  document.querySelectorAll(".videoHome").forEach((element) => {
    element.addEventListener("click", () => toggleHomeVideos(element.id));
  });

  document
    .getElementById("videoPrevView")
    .addEventListener("click", () => toggleHomeVideos("videoPrevView"));
  document
    .getElementById("videoGridView")
    .addEventListener("click", () => toggleHomeVideos("videoGridView"));
  document
    .getElementById("videoNextView")
    .addEventListener("click", () => toggleHomeVideos("videoNextView"));
  document
    .getElementById("smallVideos")
    .addEventListener("click", () => showHomePage());
  document
    .getElementById("btnHome")
    .addEventListener("click", () => showHomePage());
}

/* bar graph code */
function updateBarGraphs() {
	const barContainers = document.querySelectorAll('.vertical-bar-container');
  
	barContainers.forEach((container) => {
	  const value = parseInt(container.getAttribute('data-value'), 10);
	  const target = parseInt(container.getAttribute('data-target'), 10);

	  //update setpoint value in additional container
	  const setpointInput = document.getElementById((container.id).split('-')[1]);
	  if(setpointInput) {
		setpointInput.value = target;
	  }
  
	  const valuePercentage = Math.min(Math.max(value, 0), 100);
	  const targetPercentage = Math.min(Math.max(target, 0), 100);
  
	  const barFill = container.querySelector('.bar-fill');
	  barFill.style.height = `${valuePercentage}%`;
  
	  const targetMarker = container.querySelector('.target-marker');
	  targetMarker.style.bottom = `${targetPercentage}%`;
  
	  const barLabel = container.querySelector('.bar-label');
	  barLabel.textContent = `${value}`;
  
	  const tickMarksContainer = container.querySelector('.tick-marks');
	  tickMarksContainer.innerHTML = '';
  
	  const numTicks = 5;
	  for (let i = 1; i <= numTicks; i++) { // Start from 1 to exclude 0
		const positionPercentage = (i / numTicks) * 100;
  
		const tickLeft = document.createElement('div');
		tickLeft.classList.add('tick', 'left');
		tickLeft.style.bottom = `${positionPercentage}%`;
  
		const tickRight = document.createElement('div');
		tickRight.classList.add('tick', 'right');
		tickRight.style.bottom = `${positionPercentage}%`;
  
		const tickLabelLeft = document.createElement('div');
		tickLabelLeft.classList.add('tick-label', 'left');
		tickLabelLeft.style.bottom = `${positionPercentage}%`;
		tickLabelLeft.textContent = Math.round((i / numTicks) * 100);
  
		const tickLabelRight = document.createElement('div');
		tickLabelRight.classList.add('tick-label', 'right');
		tickLabelRight.style.bottom = `${positionPercentage}%`;
		tickLabelRight.textContent = Math.round((i / numTicks) * 100);
  
		tickMarksContainer.appendChild(tickLeft);
		tickMarksContainer.appendChild(tickRight);
		tickMarksContainer.appendChild(tickLabelLeft);
		tickMarksContainer.appendChild(tickLabelRight);
	  }
	});
  }

  const initStatus = () => {
    const initialStatus = {
        digger: true,
        hump: true,
        depthWheel: true,
        axle: true,
        priShaker: true,
        secShaker: true,
    };

    localStorage.setItem("autoStatus", JSON.stringify(initialStatus));
};

const initializePresets = () => {
    const presets = {
        preset1: {
            title: 'Preset 1',
            saved: true,
            depth: 30,
            priShaker: 30,
            secShaker: 30,
            axle: 25,
            titleNew: 'Preset 1',
            depthNew: 30,
            priShakerNew: 30,
            secShakerNew: 30,
            axleNew: 25,
        },
        preset2: {
            title: 'Preset 2',
            saved: true,
            depth: 30,
            priShaker: 30,
            secShaker: 30,
            axle: 25,
            titleNew: 'Preset 2',
            depthNew: 30,
            priShakerNew: 30,
            secShakerNew: 30,
            axleNew: 25,
        },
        preset3: {
            title: 'Preset 3',
            saved: true,
            depth: 30,
            priShaker: 30,
            secShaker: 30,
            axle: 25,
            titleNew: 'Preset 3',
            depthNew: 30,
            priShakerNew: 30,
            secShakerNew: 30,
            axleNew: 25,
        },
        presetA: {
            title: 'Preset A',
            saved: true,
            gap: 30,
            height: 30,
            angle: 30,
            clodRollerSpeed: 25,
            segmentRollerSpeed: 25,
            spreaderRollerSpeed: 25,
            cleanMode: true,
            titleNew: 'Preset A',
            gapNew: 30,
            heightNew: 30,
            angleNew: 30,
            clodRollerSpeedNew: 25,
            segmentRollerSpeedNew: 25,
            spreaderRollerSpeedNew: 25,
            cleanModeNew: true,
        },
        presetB: {
            title: 'Preset B',
            saved: true,
            gap: 30,
            height: 30,
            angle: 30,
            clodRollerSpeed: 25,
            segmentRollerSpeed: 25,
            spreaderRollerSpeed: 25,
            cleanMode: true,
            titleNew: 'Preset B',
            gapNew: 30,
            heightNew: 30,
            angleNew: 30,
            clodRollerSpeedNew: 25,
            segmentRollerSpeedNew: 25,
            spreaderRollerSpeedNew: 25,
            cleanModeNew: true,
        },
        presetC: {
            title: 'Preset C',
            saved: true,
            gap: 30,
            height: 30,
            angle: 30,
            clodRollerSpeed: 25,
            segmentRollerSpeed: 25,
            spreaderRollerSpeed: 25,
            cleanMode: true,
            titleNew: 'Preset C',
            gapNew: 30,
            heightNew: 30,
            angleNew: 30,
            clodRollerSpeedNew: 25,
            segmentRollerSpeedNew: 25,
            spreaderRollerSpeedNew: 25,
            cleanModeNew: true,
        },
    };

    for (const [key, value] of Object.entries(presets)) {
        if (!localStorage.getItem(key)) {
            localStorage.setItem(key, JSON.stringify(value));
        }
    }
};

