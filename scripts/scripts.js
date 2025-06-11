let direction = 'environment';
let currentStream = null;
let onlyHasUserCamera = false;
var elem = document.documentElement;

let minimum = false;

let run = 0;
let blocked = 0;
let uploadfix = 0;

const denied = document.getElementById('denied');
const prompt = document.getElementById('prompt');
const tick = document.getElementById('tick');
const cross = document.getElementById('cross');
const loadingscreen = document.getElementById('loadingscreen');
const nocamera = document.getElementById('nocamera');

denied.style.display = "none";
prompt.style.display = "none";
tick.style.display = "none";
cross.style.display = "none";
nocamera.style.display = '';

let camerasavailable = 1;

function changeFullscreen() {
  if (document.fullscreenElement) {
    closeFullscreen()
  }
  else {
    openFullscreen()
  }
}

function openSidebar() {
  document.getElementById("sidebar").classList.add("open");
}

function closeSidebar() {
  document.getElementById("sidebar").classList.remove("open");
}

function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { 
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { 
    elem.msRequestFullscreen();
  }
}
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) { 
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { 
    document.msExitFullscreen();
  }
}

async function detectCameras() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoInputs = devices.filter(device => device.kind === 'videoinput');

    if (videoInputs.length === 1) {
        direction = 'user';
        onlyHasUserCamera = true;
    } else if (videoInputs.length === 0) {
        camerasavailable = 0;
        nocamera.style.display = '';
    } else {
        onlyHasUserCamera = false;
    }
}


function promptAccepted() {
    prompt.style.display = 'none';

    navigator.mediaDevices.getUserMedia({ video: { facingMode: direction } })
        .then(stream => {
            currentStream = stream;
            const video = document.getElementById('video');
            video.srcObject = stream;

            const shouldFlip = direction === 'user' || onlyHasUserCamera;
            video.style.transform = shouldFlip ? 'scaleX(-1)' : 'scaleX(1)';
            video.style.display = 'block';
            nocamera.style.display = 'none';
            blocked = 0;
        })
        .catch(() => {
            blocked = 1;
            nocamera.style.display = '';
            denied.style.display = '';
        });
}

function promptClose() {
    prompt.style.display = 'none';
    nocamera.style.display = '';
    uploadfix = 1;
}

function deniedClose() {
    denied.style.display = 'none';
}

function loadingScreen() {
    loadingscreen.style.display = '';
    loadingscreen.style.opacity = 1;
}

function endLoadingScreen() {
    if (minimum === true) {
        setTimeout(() => {
            loadingscreen.style.opacity = 0;
            loadingscreen.addEventListener('transitionend', () => {
                loadingscreen.style.display = 'none';
                loadingscreen.style.opacity = 1; 
            }, { once: true });
        }, 100);
    } else {
        setTimeout(endLoadingScreen, 100);
    }
}


async function startCamera() {
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
        currentStream = null;
    }

    await detectCameras();

    if (camerasavailable === 0) {
        nocamera.style.display = '';
        return;
    }

    navigator.permissions.query({ name: 'camera' }).then(result => {
        if (result.state === 'granted') {
            navigator.mediaDevices.getUserMedia({ video: { facingMode: direction } })
                .then(stream => {
                    currentStream = stream;
                    const video = document.getElementById('video');
                    video.srcObject = stream;
                    run = 1;

                    const shouldFlip = direction === 'user' || onlyHasUserCamera;
                    video.style.transform = shouldFlip ? 'scaleX(-1)' : 'scaleX(1)';
                    video.style.display = 'block';
                    nocamera.style.display = 'none';
                    blocked = 0;
                })
                .catch(() => {
                    blocked = 1;
                    nocamera.style.display = '';
                    denied.style.display = '';
                });

        } else if (result.state === 'prompt') {
            run = 1;
            prompt.style.display = '';
            nocamera.style.display = '';

        } else if (result.state === 'denied') {
            run = 1;
            blocked = 1;
            denied.style.display = '';
            nocamera.style.display = '';
        }
    });
}

function changeValue() {
    direction = (direction === 'environment') ? 'user' : 'environment';
    startCamera();
}

function getValue() {
    return direction;
}

function acceptordeny() {
    tick.style.display = "";
    cross.style.display = "";
}

function acceptedPhoto() {
    tick.style.display = "none";
    cross.style.display = "none";

    loadingScreen();     
    minimum = false;     
    setTimeout(timed, 400); 

    runAIFromPhoto();
}

function retakePhoto() {
    const photo = document.getElementById('photo');
    photo.style.display = 'none';
    const button2 = document.getElementById('birb');
    const button3 = document.getElementById('uploadbutton');
    const button1 = document.getElementById('button1');

    button1.style.display = '';
    button2.style.display = '';
    button3.style.display = '';
    tick.style.display = "none";
    cross.style.display = "none";

    if (camerasavailable === 0 || blocked === 1) {
        nocamera.style.display = '';
    }
    startCamera();
}


function changeFullscreenButton() {
  if (document.fullscreenElement) {
    document.getElementById("fullscreen").src = "images/ui/exitfullscreen.png";
  } 
  else {
    document.getElementById("fullscreen").src = "images/ui/fullscreen.png";
  }

}

function upload() {
    const fileInput = document.getElementById('fileInput');
    const canvas = document.getElementById('canvas');
    const photo = document.getElementById('photo');
    const button1 = document.getElementById('button1');
    const button2 = document.getElementById('birb');
    const button3 = document.getElementById('uploadbutton');
    const video = document.getElementById('video');

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function(event) {
            const img = new Image();
            img.src = event.target.result;

            img.onload = function() {
                canvas.width = img.width;
                canvas.height = img.height;

                const context = canvas.getContext('2d');
                context.drawImage(img, 0, 0, canvas.width, canvas.height);

                photo.src = canvas.toDataURL('image/png');
                photo.style.display = '';
                
                if (currentStream) {
                    currentStream.getTracks().forEach(track => track.stop());
                    currentStream = null;
                }

                video.srcObject = null;
                video.style.display = 'none';
                button1.style.display = 'none';
                button2.style.display = 'none';
                button3.style.display = 'none';
                nocamera.style.display = 'none';
              
                acceptordeny();
            };
        };
        reader.readAsDataURL(file); 
    }
}

function takePhoto() {
    if (nocamera.style.display == 'none') {
      const video = document.getElementById('video');
      const canvas = document.getElementById('canvas');
      const photo = document.getElementById('photo');
      const button1 = document.getElementById('button1');
      const button2 = document.getElementById('birb');
      const button3 = document.getElementById('uploadbutton');
  
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
  
      const context = canvas.getContext('2d');
  
      const shouldFlip = direction === 'user' || onlyHasUserCamera;
      if (shouldFlip) {
          context.translate(canvas.width, 0);
          context.scale(-1, 1);
      }
  
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
  
      const imageDataURL = canvas.toDataURL('image/png');
      photo.src = imageDataURL;
  
      currentStream.getTracks().forEach(track => track.stop());
      currentStream = null;
      video.srcObject = null;
      video.style.display = 'none';
      photo.style.display = '';
      button1.style.display = 'none';
      button2.style.display = 'none';
      button3.style.display = 'none';
    }
}

function timed() {
    minimum = true;
}

function flash() {
    if (camerasavailable === 1 && blocked === 0 && nocamera.style.display = 'none') {
        const flashDiv = document.createElement('div');
        flashDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: white;
            opacity: 1;
            z-index: 9999;
            pointer-events: none;
            transition: opacity 0.5s;
        `;
        document.body.appendChild(flashDiv);

        setTimeout(() => {
            flashDiv.style.opacity = 0;
            setTimeout(() => {
                document.body.removeChild(flashDiv);
            }, 500);
        }, 100);
        acceptordeny();
    }
}



loadingScreen();
setInterval(changeFullscreenButton, 20);
setTimeout(timed, 400)
startCamera()
