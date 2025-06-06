let aiSession = null;
const modelPath = '/plant_model.onnx';

window.addEventListener('DOMContentLoaded', async () => {
  try {
    aiSession = await ort.InferenceSession.create(modelPath);
    // alert("ONNX model loaded.");
  } catch (err) {
    alert("Failed to load ONNX model: " + err.message);
    console.error("ONNX load error:", err);
  }
});

async function runAIFromPhoto() {
  if (!aiSession) {
    alert("AI model not loaded yet.");
    return;
  }

  const photo = document.getElementById('photo');
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const inputSize = 224;
  canvas.width = inputSize;
  canvas.height = inputSize;
  ctx.drawImage(photo, 0, 0, inputSize, inputSize);

  const imageData = ctx.getImageData(0, 0, inputSize, inputSize);
  const inputTensor = preprocessImage(imageData);

  try {
    const inputName = aiSession.inputNames[0];  // safer than hardcoding "input"
    const outputMap = await aiSession.run({ [inputName]: inputTensor });
    
    const output = outputMap[Object.keys(outputMap)[0]];
    const prediction = postprocess(output.data);
    
    alert("Prediction complete");
  } catch (err) {
    alert("Error during inference: " + err.message);
    console.error("Inference error:", err);
  }
}

function preprocessImage(imageData) {
  const { data, width, height } = imageData;
  const floatData = new Float32Array(width * height * 3);
  for (let i = 0; i < width * height; i++) {
    floatData[i] = data[i * 4] / 255;                       // R
    floatData[i + width * height] = data[i * 4 + 1] / 255;  // G
    floatData[i + 2 * width * height] = data[i * 4 + 2] / 255; // B
  }
  return new ort.Tensor('float32', floatData, [1, 3, height, width]);
}

function postprocess(data) {
  const maxIndex = data.indexOf(Math.max(...data));
  window.location.href = `/plant?ID=${maxIndex + 1}`;
}
