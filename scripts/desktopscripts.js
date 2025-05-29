let direction = 'environment';
let fullscreened = 0;
let currentStream = null;
let onlyHasUserCamera = false;
var elem = document.documentElement;

const denied = document.getElementById('denied');
const prompt = document.getElementById('prompt');

let camerasavailable = 1;

denied.style.display = "none";
prompt.style.display = "none";

const tick = document.getElementById('tick');
const cross = document.getElementById('cross');

tick.style.display = "none";
cross.style.display = "none";

const nocamera = document.getElementById('nocamera');

nocamera.style.display = "none";

async function detectCameras() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoInputs = devices.filter(device => device.kind === 'videoinput');

    if (videoInputs.length === 1) {
        direction = 'user';
        onlyHasUserCamera = true;
    } 
    else if (videoInputs.length === 0) {
        nocamera.style.display = '';
        camerasavailable = 0;
    }
    else {
        onlyHasUserCamera = false;
    }
}

function promptAccepted() {
    prompt.style.display = 'none';
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
        nocamera.style.display = '';
    });
}

async function startCamera() {
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
        currentStream = null;
    }

    await detectCameras();
    navigator.permissions.query({ name: 'camera' }).then((result) => {
        if (result.state === 'granted') {
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
                nocamera.style.display = '';
            });
      } else if (result.state === 'prompt') {
            if (camerasavailable == 1) {
                prompt.style.display = '';
            }
      } else if (result.state === 'denied') {
            nocamera.style.display = '';
            denied.style.display = '';
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
    tick.style.display = '';
    cross.style.display = '';
}

function acceptedPhoto() {
    tick.style.display = "none";
    cross.style.display = "none";
}

function retakePhoto() {
    const photo = document.getElementById('photo');
    photo.style.display = 'none';
    const button2 = document.getElementById('birb');
    const button3 = document.getElementById('uploadbutton');

    button2.style.display = '';
    button3.style.display = '';
    tick.style.display = "none";
    cross.style.display = "none";

    startCamera();
    
}

function upload() {
    const video = document.getElementById('video');
    const fileInput = document.getElementById('fileInput'); 
    const canvas = document.getElementById('canvas');
    const photo = document.getElementById('photo');
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

                if (camerasavailable == 1) {
                    currentStream.getTracks().forEach(track => track.stop());
                    currentStream = null;
                }
                alert('3');
                video.srcObject = null;
                alert('4');
                video.style.display = 'none';
                alert('5');
                button2.style.display = 'none';
                alert('6');
                button3.style.display = 'none';
                alert('7');
                
                photo.style.display = '';
                    
                acceptordeny()
            };
        };

        reader.readAsDataURL(file);
    }
}

function takePhoto() {
    if (camerasavailable == 1) {
        const video = document.getElementById('video');
        const canvas = document.getElementById('canvas');
        const photo = document.getElementById('photo');
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
        photo.style.display = '';
        video.style.display = 'none';
        button2.style.display = 'none';
        button3.style.display = 'none';
    }
}

function flash() {
  if (camerasavailable == 1) {
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
        setTimeout(() => {
          document.body.removeChild(flashDiv);
        }, 500);
      }, 100);
      acceptordeny();
  }
}

function startcam() {
    startCamera()
}
