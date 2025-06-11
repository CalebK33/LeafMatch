let aiSession = null;
const modelPath = '/plant_model.onnx';

window.addEventListener('DOMContentLoaded', async () => {
  try {
    aiSession = await ort.InferenceSession.create(modelPath);
  } catch (err) {
    console.error("ONNX load error:", err);
  }
});

async function runAIFromPhoto() {
  while (!aiSession) {
    await new Promise(resolve => setTimeout(resolve, 100));
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
    const inputName = aiSession.inputNames[0]; 
    const outputMap = await aiSession.run({ [inputName]: inputTensor });

    const output = outputMap[Object.keys(outputMap)[0]];
    const scores = output.data;
    const maxScore = Math.max(...scores);
    const predictedIndex = scores.indexOf(maxScore);

    const expScores = scores.map(x => Math.exp(x));
    const sumExp = expScores.reduce((a, b) => a + b, 0);
    const confidence = (Math.exp(scores[predictedIndex]) / sumExp) * 100;
    postprocess(scores, confidence);
    
  } catch (err) {
    console.error("Inference error:", err);
  }
}

function preprocessImage(imageData) {
  const { data, width, height } = imageData;
  const floatData = new Float32Array(width * height * 3);
  for (let i = 0; i < width * height; i++) {
    floatData[i] = data[i * 4] / 255;                      
    floatData[i + width * height] = data[i * 4 + 1] / 255; 
    floatData[i + 2 * width * height] = data[i * 4 + 2] / 255; 
  }
  return new ort.Tensor('float32', floatData, [1, 3, height, width]);
}

function postprocess(data, conf) {
  const maxIndex = data.indexOf(Math.max(...data));
  alert("confidence level: " + conf)
  window.location.href = `/plant?ID=${maxIndex + 1}`;
}
