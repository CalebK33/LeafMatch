let direction = 'environment';
let fullscreened = 0;
let currentStream = null;
let onlyHasUserCamera = false;
let run = 0;
let blocked = 0;
let camerasAvailable = 1;

const elem = document.documentElement;
const denied = document.getElementById('denied');
const prompt = document.getElementById('prompt');
const tick = document.getElementById('tick');
const cross = document.getElementById('cross');
const nocamera = document.getElementById('nocamera');

denied.style.display = 'none';
prompt.style.display = 'none';
tick.style.display = 'none';
cross.style.display = 'none';
nocamera.style.display = '';

async function detectCameras() {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const videoInputs = devices.filter(d => d.kind === 'videoinput');

  if (videoInputs.length === 1) {
    direction = 'user';
    onlyHasUserCamera = true;
  } else if (videoInputs.length === 0) {
    nocamera.style.display = '';
    camerasAvailable = 0;
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

      const flip = direction === 'user' || onlyHasUserCamera;
      video.style.transform = flip ? 'scaleX(-1)' : 'scaleX(1)';
      video.style.display = 'block';
      nocamera.style.display = 'none';
    })
    .catch(() => {
      nocamera.style.display = '';
      blocked = 1;
    });
}

function promptClose() {
  prompt.style.display = 'none';
}

async function startCamera() {
  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop());
    currentStream = null;
  }

  await detectCameras();

  navigator.permissions.query({ name: 'camera' }).then(result => {
    if (result.state === 'granted') {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: direction } })
        .then(stream => {
          if (camerasAvailable === 1) {
            currentStream = stream;
            const video = document.getElementById('video');
            video.srcObject = stream;
            run = 1;

            const flip = direction === 'user' || onlyHasUserCamera;
            video.style.transform = flip ? 'scaleX(-1)' : 'scaleX(1)';
            video.style.display = 'block';
          } else {
            run = 1;
            nocamera.style.display = '';
          }
        })
        .catch(() => {
          nocamera.style.display = '';
        });
    } else if (result.state === 'prompt' && camerasAvailable === 1) {
      run = 1;
      prompt.style.display = '';
    } else if (result.state === 'denied' && run === 0) {
      nocamera.style.display = '';
      denied.style.display = '';
      run = 1;
      blocked = 1;
    }
  });
}

function changeValue() {
  direction = direction === 'environment' ? 'user' : 'environment';
  startCamera();
}

function getValue() {
  return direction;
}

function acceptOrDeny() {
  tick.style.display = '';
  cross.style.display = '';
}

function acceptedPhoto() {
  tick.style.display = 'none';
  cross.style.display = 'none';
}

function retakePhoto() {
  document.getElementById('photo').style.display = 'none';
  document.getElementById('birb').style.display = '';
  document.getElementById('uploadbutton').style.display = '';

  tick.style.display = 'none';
  cross.style.display = 'none';

  if (camerasAvailable === 0 || blocked === 1) {
    nocamera.style.display = '';
  }

  startCamera();
}

function upload() {
  const video = document.getElementById('video');
  const fileInput = document.getElementById('fileInput');
  const canvas = document.getElementById('canvas');
  const photo = document.getElementById('photo');
  const button2 = document.getElementById('birb');
  const button3 = document.getElementById('uploadbutton');

  if (fileInput.files.length === 0) return;

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = e => {
    const img = new Image();
    img.src = e.target.result;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      photo.src = canvas.toDataURL('image/png');

      if (camerasAvailable === 1 && blocked === 0) {
        currentStream.getTracks().forEach(track => track.stop());
        currentStream = null;
      }

      video.srcObject = null;
      video.style.display = 'none';
      button2.style.display = 'none';
      button3.style.display = 'none';
      photo.style.display = '';
      nocamera.style.display = 'none';

      acceptOrDeny();
    };
  };

  reader.readAsDataURL(file);
}

function takePhoto() {
  if (camerasAvailable !== 1 || blocked === 1) return;

  const video = document.getElementById('video');
  const canvas = document.getElementById('canvas');
  const photo = document.getElementById('photo');
  const button2 = document.getElementById('birb');
  const button3 = document.getElementById('uploadbutton');

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext('2d');

  if (direction === 'user' || onlyHasUserCamera) {
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
  }

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  photo.src = canvas.toDataURL('image/png');

  currentStream.getTracks().forEach(track => track.stop());
  currentStream = null;

  video.srcObject = null;
  video.style.display = 'none';
  photo.style.display = '';
  button2.style.display = 'none';
  button3.style.display = 'none';
}

function flash() {
  if (camerasAvailable !== 1 || blocked === 1) return;

  const flashDiv = document.createElement('div');
  flashDiv.style.cssText = `
    position: fixed;
    top: 0;
    left: 25%;
    width: 50vw;
    height: 100vh;
    background-color: white;
    opacity: 1;
    z-index: 9999;
    pointer-events: none;
    transition: opacity 0.5s;
  `;

  document.body.appendChild(flashDiv);

  setTimeout(() => {
    flashDiv.style.opacity = 0;
    setTimeout(() => document.body.removeChild(flashDiv), 500);
  }, 100);

  acceptOrDeny();
}

startCamera();
