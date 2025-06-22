let direction = 'environment';
let fullscreened = 0;
let currentStream = null;
let onlyHasUserCamera = false;
var elem = document.documentElement;

let prompton = 0;
let minimum = false;

let run = 0;
let blocked = 0;
let uploadfix = 0;
let runbefore = 0;

const failed = document.getElementById('failed');
const denied = document.getElementById('denied');
const prompt = document.getElementById('prompt');
const tick = document.getElementById('tick');
const cross = document.getElementById('cross');
const loadingscreen = document.getElementById('loadingscreen');
const nocamera = document.getElementById('nocamera');
const smallloader = document.getElementById('smallloader')

failed.style.display = "none";
denied.style.display = "none";
prompt.style.display = "none";
tick.style.display = "none";
cross.style.display = "none";
nocamera.style.display = '';
smallloader.style.display = "none";

let camerasavailable = 1;

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

function changeValue() {
    if (prompton == 0) {
      direction = (direction === 'environment') ? 'user' : 'environment';
      startCamera();
    }
}

function promptAccepted() {
    prompt.style.display = 'none';
    prompton = 0;

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
    prompton = 0;
    prompt.style.display = 'none';
    nocamera.style.display = '';
    uploadfix = 1;
}

function deniedClose() {
    prompton = 0;
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
                });

        } else if (result.state === 'prompt') {
            if (runbefore == 0) {
                runbefore = 1;
                run = 1;
                prompt.style.display = '';
                nocamera.style.display = '';
                prompton = 1;
            }
            else {
                nocamera.style.display = '';
            }

        } else if (result.state === 'denied') {
            if (runbefore == 0) {
                runbefore = 1;
                run = 1;
                blocked = 1;
                denied.style.display = '';
                nocamera.style.display = '';
                prompton = 1;
            }
            else {
                nocamera.style.display = '';
            }
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
    smallloader.style.display = "none";
    tick.style.display = '';
    cross.style.display = '';
}

function acceptedPhoto() {
    tick.style.display = "none";
    cross.style.display = "none";
    
    loadingscreen.style.opacity = 0;
    loadingScreen();     
    minimum = false;     
    setTimeout(timed, 400); 

    runAIFromPhoto();   
}

function retakePhoto() {
    failed.style.display = "none";
    const photo = document.getElementById('photo');
    photo.style.display = 'none';
    const button2 = document.getElementById('birb');
    const button3 = document.getElementById('uploadbutton');
    document.getElementById('nocameraback').src = 'images/ui/nocamera.jpg';

    button2.style.display = '';
    button3.style.display = '';
    tick.style.display = "none";
    cross.style.display = "none";

    document.getElementById('fileInput').value = '';

    if (camerasavailable === 0 || blocked === 1) {
        nocamera.style.display = '';
    }

    startCamera();
}

function uploadstart() {
    if (prompton == 0) {
        document.getElementById('fileInput').click()
    }
}

function upload() {
    if (prompton == 0) {
        const video = document.getElementById('video');
        const fileInput = document.getElementById('fileInput');
        const canvas = document.getElementById('canvas');
        const photo = document.getElementById('photo');
        const button2 = document.getElementById('birb');
        const button3 = document.getElementById('uploadbutton');
    
        if (fileInput.files.length > 0) {
            smallloader.style.display = ""
            const file = fileInput.files[0];
            const reader = new FileReader();
    
            reader.onload = function (event) {
                const img = new Image();
                img.src = event.target.result;
    
                img.onload = function () {
                    document.getElementById('nocameraback').src = 'images/ui/white.png';
                    canvas.width = img.width;
                    canvas.height = img.height;
    
                    const context = canvas.getContext('2d');
                    context.drawImage(img, 0, 0, canvas.width, canvas.height);
    
                    photo.src = canvas.toDataURL('image/png');
    
                    if (camerasavailable === 1 && blocked === 0 && uploadfix === 0) {
                        currentStream.getTracks().forEach(track => track.stop());
                        currentStream = null;
                    }
    
                    video.srcObject = null;
    
                    nocamera.style.display = "none";
                    video.style.display = 'none';
                    button2.style.display = 'none';
                    button3.style.display = 'none';
    
                    photo.style.display = '';
                    acceptordeny();
                };
            };
    
            reader.readAsDataURL(file);
        }
    }
}

function takePhoto() {
    if (camerasavailable === 1 && blocked === 0 && nocamera.style.display == 'none' && prompton == 0) {
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
    else {
        prompt.style.display = '';
    }
}

function timed() {
    minimum = true;
}

function flash() {
    if (camerasavailable === 1 && blocked === 0 && nocamera.style.display == 'none') {
        const flashDiv = document.createElement('div');
        flashDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 25%;
            width: 50vw;
            height: 100vh;
            background-color: white;
            opacity: 1;
            z-index: 999;
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

startCamera();
loadingScreen();
setTimeout(timed, 400);

document.addEventListener('keydown', function (event) {
    const activeElement = document.activeElement;
    const isTyping = activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.isContentEditable;

    if (!isTyping && event.code === 'Space') {
        event.preventDefault();
        takePhoto();
        acceptordeny();
    } else if (!isTyping && event.code === 'p') {
        event.preventDefault(); 
        changeValue();
        startcamera();
    }
});
