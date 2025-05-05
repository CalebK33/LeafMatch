let direction = 'environment';
let currentStream = null;

function startCamera() {
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
        currentStream = null;
}

navigator.mediaDevices.getUserMedia({
    video: { facingMode: direction }
})
.then(stream => {
    currentStream = stream; 
    document.getElementById('video').srcObject = stream;
})
.catch(err => {
    console.error("Camera error:", err);
});
}

function changeValue() {
direction = (direction === 'environment') ? 'user' : 'environment';
startCamera();
}

function getValue() {
    return direction
}

function takePhoto() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const photo = document.getElementById('photo');
    const button1 = document.getElementById('button1');
    const button2 = document.getElementById('button2');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageDataURL = canvas.toDataURL('image/png');

    photo.src = imageDataURL;
    currentStream.getTracks().forEach(track => track.stop());
    currentStream = null;
    video.srcObject = null;
    video.style.display = 'none';
    button1.style.display = 'none';
    button2.style.display = 'none';
}
startCamera();
