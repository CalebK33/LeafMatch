let direction = 'environment';
let fullscreened = 0;
let currentStream = null;
let onlyHasUserCamera = false;
var elem = document.documentElement;

let run = 0;
let blocked = 0;

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
}

function deniedClose() {
    denied.style.display = 'none';
}

function loadingScreen() {
    loadingscreen.style.display = 'none';
}

function endLoadingScreen() {
    loadingscreen.style.display = '';
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

    if (camerasavailable === 0 || blocked === 1) {
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

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function (event) {
            const img = new Image();
            img.src = event.target.result;

            img.onload = function () {
                canvas.width = img.width;
                canvas.height = img.height;

                const context = canvas.getContext('2d');
                context.drawImage(img, 0, 0, canvas.width, canvas.height);

                photo.src = canvas.toDataURL('image/png');

                if (camerasavailable === 1 && blocked === 0) {
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

function takePhoto() {
    if (camerasavailable === 1 && blocked === 0) {
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
    if (camerasavailable === 1 && blocked === 0) {
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

startCamera();
loadingScreen();
