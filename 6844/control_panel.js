    // Load the saved orientation when the page loads
    window.onload = function() {
    const savedOrientation = localStorage.getItem('orientation') || 'portrait';
    const container = document.querySelector('.container');
    container.classList.add(savedOrientation);
};

// Toggle the orientation and save the state
function toggleOrientation() {
    const container = document.querySelector('.container');
    if (container.classList.contains('portrait')) {
        container.classList.remove('portrait');
        container.classList.add('landscape');
        localStorage.setItem('orientation', 'landscape');
    } else {
        container.classList.remove('landscape');
        container.classList.add('portrait');
        localStorage.setItem('orientation', 'portrait');
    }
}

function changeColorTimed(button) {
    const originalColor = button.style.backgroundColor;
    button.style.backgroundColor = '#72BB53';
    setTimeout(() => {
        button.style.backgroundColor = originalColor;
    }, 3000);
}

function toggleRUN(button) {
    var imgTags = document.getElementsByClassName('videoFeeds');
    var newExt = '.gif';
    var oldExt = '.png';
    if (button.classList.contains('button-run')) {
        button.classList.remove('button-run');
        button.classList.add('button-run-active');
        document.getElementById("status-messages").innerText = "RUN enabled";
    } else {
        button.classList.remove('button-run-active');
        button.classList.add('button-run');
        document.getElementById("status-messages").innerText = "RUN disabled";
        newExt = '.png';
        oldExt = '.gif';
    }
    for (var i = 0; i < imgTags.length; i++) {
        imgTags[i].src = imgTags[i].src.replace(oldExt, newExt);
    }
}

function toggleButtonState(button) {
    if (button.classList.contains('button-active')) {
        button.classList.remove('button-active');
    } else {
        button.classList.add('button-active');
    }
}

function togglePreset(button) {
    document.getElementById("preset1").classList.remove('button-active');
    document.getElementById("preset2").classList.remove('button-active');
    document.getElementById("preset3").classList.remove('button-active');
    button.classList.add('button-active');
}

function toggleCamera(elem) {
    document.getElementById("cameraAll").classList.add('hide');
    document.getElementById("camera1").classList.add('hide');
    document.getElementById("camera2").classList.add('hide');
    document.getElementById("camera3").classList.add('hide');
    document.getElementById("camera4").classList.add('hide');
    document.getElementById(elem).classList.remove('hide');
}

function toggleControl(elem) {
	if(document.getElementById("harvester")){
	    document.getElementById("harvester").classList.add('hide');
	}
    document.getElementById("digger").classList.add('hide');
    document.getElementById("btnDigger").classList.remove('button-active');
    document.getElementById("chains").classList.add('hide');
    document.getElementById("btnChains").classList.remove('button-active');
    document.getElementById("table").classList.add('hide');
    document.getElementById("btnTable").classList.remove('button-active');
    document.getElementById("boom").classList.add('hide');
    document.getElementById("btnBoom").classList.remove('button-active');
    document.getElementById("axle").classList.add('hide');
    document.getElementById("btnAxle").classList.remove('button-active');
    document.getElementById(elem).classList.remove('hide');
    document.getElementById("btn" + elem.charAt(0).toUpperCase() + elem.substr(1)).classList.add('button-active');
}
