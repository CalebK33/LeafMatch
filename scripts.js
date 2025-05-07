let direction = 'environment';
let currentStream = null;
let canSwitchCamera = true;

async function detectCameras() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoInputs = devices.filter(device => device.kind === 'videoinput');

    if (videoInputs.length === 1) {
        direction = 'user';
        canSwitchCamera = false;
    } else {
        direction = 'environment';
        canSwitchCamera = true;
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

        const shouldFlip = direction === 'user';
        video.style.transform = shouldFlip ? 'scaleX(-1)' : 'scaleX(1)';
        video.style.display = 'block';

        const switchButton = document.getElementById('button1');
        if (switchButton) {
            switchButton.style.display = canSwitchCamera ? 'inline-block' : 'none';
        }
    })
    .catch(err => {
        console.error("Camera error:", err);
    });
}

function changeValue() {
    if (!canSwitchCamera) return;

    direction = (direction === 'environment') ? 'user' : 'environment';
    startCamera();
}

function getValue() {
    return direction;
}

function upload() {
    
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

    const shouldFlip = direction === 'user';
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

startCamera();
