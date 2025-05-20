let direction = 'environment';
let currentStream = null;
let onlyHasUserCamera = false;
var elem = document.documentElement;


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
    } 
    else if (videoInputs.length === 0) {
        alert("I think you need a camera for this...")
    }
    else {
        onlyHasUserCamera = false;
    }
}


async function startCamera() {
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
        currentStream = null;
    }

    await detectCameras();

    navigator.mediaDevices.getUserMedia({
        video: { facingMode: direction }
    })
    .then(stream => {
        currentStream = stream;
        const video = document.getElementById('video');
        video.srcObject = stream;

        const shouldFlip = direction === 'user' || onlyHasUserCamera;
        video.style.transform = shouldFlip ? 'scaleX(-1)' : 'scaleX(1)';
        video.style.display = 'block';
    })
    .catch(err => {
        alert("Please allow access to camera or use the upload files button")
    });
}

function changeValue() {
    direction = (direction === 'environment') ? 'user' : 'environment';
    startCamera();
}

function getValue() {
    return direction;
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
                currentStream.getTracks().forEach(track => track.stop());
                currentStream = null;
                video.srcObject = null;
                video.style.display = 'none';
                button1.style.display = 'none';
                button2.style.display = 'none';
                button3.style.display = 'none';
            };
        };

        reader.readAsDataURL(file);
    }
}

function takePhoto() {
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
    button1.style.display = 'none';
    button2.style.display = 'none';
    button3.style.display = 'none';
}

function flash() {
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
}



document.addEventListener('DOMContentLoaded', () => {
  startCamera();
  setInterval(changeFullscreenButton, 20);
});
