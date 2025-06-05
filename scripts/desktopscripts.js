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
