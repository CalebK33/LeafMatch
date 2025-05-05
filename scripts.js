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

let uploadButton = document.getElementById("uploadButton");
let imageUpload = document.getElementById("imageUpload");
let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 300;

uploadButton.addEventListener("click", () => {
    imageUpload.click();
});

imageUpload.addEventListener("change", (event) => {
    let file = event.target.files[0];
    if (file) {
        let img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
    }
});

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
