


// Load the saved orientation when the page loads
window.onload = function () {
  hideShowGroundSpeedSP();
};

function bumpChainSetpoint(setPointItm, direction) {
  let setPointElem;
  if (document.querySelector(".groundMode").classList.contains("button-active")) {
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
  const setPointElem = document.getElementById(setPointItm);
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
  //chains only; no change to clod/spreader/segment roller speeds
  bumpChainSetpoint("chainIntSP", direction);
  bumpChainSetpoint("chainPriSP", direction);
  bumpChainSetpoint("chainVineSP", direction);
  bumpChainSetpoint("chainRearCrossSP", direction);
  bumpChainSetpoint("chainSideElevSP", direction);
  bumpChainSetpoint("chainPilerSP", direction);
}

function bumpInpSetpoint(id, inc) {
  let currentValue = parseInt(document.getElementById(id).value, 10);
  if (isNaN(currentValue)) {
    //do nothing
  } else {
    if (inc < 0) {
      currentValue = Math.max(currentValue + inc, 0);	//clamp to min 0
    } else {
      currentValue = Math.min(currentValue + inc, 100);	//clamp to max 100
    }
    document.getElementById(id).value = currentValue;
  }
}


function hideShowGroundSpeedSP() {
  if (document.querySelector(".groundMode").classList.contains("button-active")) {
    toggleObjectClass("speedFixed", "speedGround", "hide");
  } else {
    toggleObjectClass("speedGround", "speedFixed", "hide");
  }
}

function setChainMode(mode) {
  if (mode == "Ground") {
    toggleObjectClass("groundMode", "fixedMode", "button-active");
  } else {
    toggleObjectClass("fixedMode", "groundMode", "button-active");
  }
  hideShowGroundSpeedSP();
}

function changeColorTimed(button) {
  const originalColor = button.style.backgroundColor;
  if (originalColor == "#72BB53") {
    //ignore extra click while button is active
  } else {
    button.style.backgroundColor = "#72BB53";
    setTimeout(() => {
      button.style.backgroundColor = originalColor;
    }, 3000);
  }
}


function toggleRUN() {
  const button = document.getElementById("run-button");
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
    toggleObjectClass("chains-override", "chains-psi", "hide");
  } else {
    toggleObjectClass("chains-psi", "chains-override", "hide");
    button.classList.remove("button-run-active");
    button.classList.add("button-run");
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

function toggleAutoState(buttonFunction) {
  let autoState = getStatus('autoStatus');
  if (!autoState) {
    autoState = { priShaker: true, secShaker: true };
  }
  autoState[buttonFunction] = !autoState[buttonFunction];
  for (const [key, value] of Object.entries(autoState)) {
    const buttonCollection = document.getElementsByClassName(key + 'Auto');
    Array.from(buttonCollection).forEach((button) => {
      if (value) {
        button.classList.add('button-active');
      } else {
        button.classList.remove('button-active');
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

// Event listeners for chain mode buttons
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll(".fixedMode").forEach((element) => {
    element.addEventListener("click", () => setChainMode("Fixed"));
  });
  document.querySelectorAll(".groundMode").forEach((element) => {
    element.addEventListener("click", () => setChainMode("Ground"));
  });
});



//handle synced buttons
function handleSyncPress(id, arrowDirection) {
  if (document.getElementById(id).classList.contains('button-active')) {
    if (arrowDirection == 'up') {
      document.getElementById((id == 'coulterSync') ? 'coulterLeftUp' : 'dwLeftUp').style.backgroundColor = "#4D9920";
      document.getElementById((id == 'coulterSync') ? 'coulterRightUp' : 'dwRightUp').style.backgroundColor = "#4D9920";
      document.getElementById((id == 'coulterSync') ? 'syncBarTop' : 'syncBarDwTop').style.backgroundColor = "#4D9920";
    }
    else {
      document.getElementById((id == 'coulterSync') ? 'coulterLeftDn' : 'dwLeftDn').style.backgroundColor = "#4D9920";
      document.getElementById((id == 'coulterSync') ? 'coulterRightDn' : 'dwRightDn').style.backgroundColor = "#4D9920";
      document.getElementById((id == 'coulterSync') ? 'syncBarBottom' : 'syncBarDwBottom').style.backgroundColor = "#4D9920";
    }
  }
}
function handleSyncRelease(id, arrowDirection) {
  if (document.getElementById(id).classList.contains('button-active')) {
    if (arrowDirection == 'up') {
      document.getElementById((id == 'coulterSync') ? 'coulterLeftUp' : 'dwLeftUp').style.backgroundColor = '#808080';
      document.getElementById((id == 'coulterSync') ? 'coulterRightUp' : 'dwRightUp').style.backgroundColor = '#808080';
      document.getElementById((id == 'coulterSync') ? 'syncBarTop' : 'syncBarDwTop').style.backgroundColor = '#808080';
    }
    else {
      document.getElementById((id == 'coulterSync') ? 'coulterLeftDn' : 'dwLeftDn').style.backgroundColor = '#808080';
      document.getElementById((id == 'coulterSync') ? 'coulterRightDn' : 'dwRightDn').style.backgroundColor = '#808080';
      document.getElementById((id == 'coulterSync') ? 'syncBarBottom' : 'syncBarDwBottom').style.backgroundColor = '#808080';
    }
  }
}



// === Modal: open on overlay-button clicks ===
document.addEventListener('DOMContentLoaded', function () {
  try {
    const modal = document.getElementById('ui-modal');
    if (!modal) return;
    const backdrop = modal.querySelector('.ui-modal__backdrop');
    const closeBtn = modal.querySelector('.ui-modal__close');
    const titleEl = modal.querySelector('#ui-modal-title');

    function openModal(titleText) {
      if (titleEl) titleEl.textContent = titleText || 'Selection';
      modal.setAttribute('aria-hidden', 'false');
      closeBtn && closeBtn.focus();
      document.addEventListener('keydown', onKey);
    }
    function closeModal() {
      modal.setAttribute('aria-hidden', 'true');
      document.removeEventListener('keydown', onKey);
    }
    function onKey(e) {
      if (e.key === 'Escape') closeModal();
    }

    [backdrop, closeBtn].forEach(el => el && el.addEventListener('click', (e) => {
      if (e.currentTarget.dataset.close !== undefined) closeModal();
    }));


    document.addEventListener('click', function (e) {
      const btn = e.target.closest && e.target.closest('.overlay-button');
      if (!btn) return;

      const label = (btn.firstChild && btn.firstChild.nodeType === Node.TEXT_NODE ? btn.firstChild.nodeValue : btn.textContent)
        .trim().split('\\n')[0] || 'Selection';

      const infoEl = btn.querySelector('.btn-info');
      const info = infoEl ? infoEl.textContent.trim() : '';

      const contentMap = {
        'Fan': '<p>The <strong>Fan</strong> controls airflow to aid cleaning.</p>',
        'MultiSep': '<p><strong>MultiSep</strong> separates soil / clods.</p>',
        'Shakers': `<p><strong>Shakers</strong> assist soil removal. Current: <em>${info || '—'}</em>.</p>
                    <ul><li>Increase on heavy soil.</li><li>Decrease to protect tubers.</li></ul>`,
        'Boom/Hopper': `<p><strong>Boom/Hopper</strong> controls discharge and conveyor. Current: <em>${info || '—'}</em>.</p>
                        <ul><li>Match truck speed to fpm.</li><li>Avoid overfilling the pile.</li></ul>`,
        'Hump': '<img src="./icons/7040FrontOnly.png" alt="Hump Image" class="ModalImage"><table>' +
          '<tbody><tr><td><button class="arrowUp ter-button ter icon-lg" id="humpUp" onmousedown="" onmouseup=""></button><br/>' +
          '<button class="arrowDown ter-button ter icon-lg" id="humpDn" onmousedown="" onmouseup=""></button><br/>' +
          '</td><td style="width: 70px;"><div style="margin-left: 12px;" class="vertical-bar"><div class="bar-fill" style="height: 48%;"></div>' +
					'<div class="target-marker" style="bottom: 46%;"></div><div class="tick-marks"><div class="tick left" style="bottom: 20%;"></div>'+
          '<div class="tick right" style="bottom: 20%;"></div><div class="tick-label left" style="bottom: 20%;">20</div>'+
          '<div class="tick-label right" style="bottom: 20%;">20</div><div class="tick left" style="bottom: 40%;"></div>'+
          '<div class="tick right" style="bottom: 40%;"></div><div class="tick-label left" style="bottom: 40%;">40</div>'+
          '<div class="tick-label right" style="bottom: 40%;">40</div><div class="tick left" style="bottom: 60%;"></div>'+
          '<div class="tick right" style="bottom: 60%;"></div><div class="tick-label left" style="bottom: 60%;">60</div>'+
          '<div class="tick-label right" style="bottom: 60%;">60</div><div class="tick left" style="bottom: 80%;"></div>'+
          '<div class="tick right" style="bottom: 80%;"></div><div class="tick-label left" style="bottom: 80%;">80</div>'+
          '<div class="tick-label right" style="bottom: 80%;">80</div><div class="tick left" style="bottom: 100%;"></div>'+
          '<div class="tick right" style="bottom: 100%;"></div><div class="tick-label left" style="bottom: 100%;">100</div>'+
          '<div class="tick-label right" style="bottom: 100%;">100</div></div></div></td>'+
          '<td><button class="b-auto ter-button ter button-active humpAuto" onclick="">Auto</button>'+
          '<br><button class="b-auto ter-button ter" onclick="">Set</button>'+
          '</td></tr></tbody></table>',
        'Depth Wheels': '<p><strong>Depth Wheels</strong> set dig depth. Current: <em>${info || "—"}</em>.</p>',
        'Coulters': '<img src="./icons/7040FrontOnly.png" alt="Coulter Image" class="ModalImage"><div class="hide ter syncBars" id="syncBarTop"></div><div class="hide ter syncBars" id="syncBarBottom"></div><table>' +
          '<tbody><tr><td><h4>Left</h4><button class="arrowUp ter-button ter icon-lg" id="coulterLeftUp" onmousedown="handleSyncPress(\'coulterSync\',\'up\')" onmouseup="handleSyncRelease(\'coulterSync\',\'up\')"></button><br/>' +
          '<button class="arrowDown ter-button ter icon-lg" id="coulterLeftDn" onmousedown="handleSyncPress(\'coulterSync\',\'dn\')" onmouseup="handleSyncRelease(\'coulterSync\',\'dn\')"></button><br/>' +
          '</td><td><button class="b-link ter-button ter icon" id="coulterSync" onclick="toggleButtonState(this)">Sync</button><br/></td><td><h4>Right</h4>' +
          '<button class="arrowUp ter-button ter icon-lg" id="coulterRightUp" onmousedown="handleSyncPress(\'coulterSync\',\'up\')" onmouseup="handleSyncRelease(\'coulterSync\',\'up\')"></button><br/>' +
          '<button class="arrowDown ter-button ter icon-lg" id="coulterRightDn" onmousedown="handleSyncPress(\'coulterSync\',\'dn\')" onmouseup="handleSyncRelease(\'coulterSync\',\'dn\')"></button><br/>' +
          '</td></tr></tbody></table>',
        'Digger Blade': `<p><strong>Digger Blade</strong> angle/height affects intake. Current: <em>${info || '—'}</em>.</p>
                         <ul><li>Raise slightly in rocky patches.</li></ul>`
      };

      const fallback = `<p>This is placeholder text for <strong>${label}</strong>. Current setting: <em>${info || '—'}</em>.</p>
                        <p>Add troubleshooting steps or quick actions here.</p>`;

      const contentHTML = contentMap[label] || fallback;

      const modal = document.getElementById('ui-modal');
      if (!modal) return;
      const contentEl = modal.querySelector('.ui-modal__content');
      const titleEl = modal.querySelector('#ui-modal-title');
      if (titleEl) titleEl.textContent = label;
      if (contentEl) contentEl.innerHTML = contentHTML;

      modal.setAttribute('aria-hidden', 'false');
      const closeBtn = modal.querySelector('.ui-modal__close');
      if (closeBtn) closeBtn.focus();
      function escClose(ev) { if (ev.key === 'Escape') { modal.setAttribute('aria-hidden', 'true'); document.removeEventListener('keydown', escClose); } }
      document.addEventListener('keydown', escClose);
    });
  } catch (err) {
    console.warn('Modal init failed:', err);
  }
});
// === end modal ===
