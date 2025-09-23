const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let currentTool = 'pencil';
let currentColor = 'black';
let drawing = false;

document.querySelectorAll('.tool').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tool').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentTool = btn.dataset.tool;
  });
});

document.querySelectorAll('.color').forEach(c => {
  c.addEventListener('click', () => {
    currentColor = c.dataset.color;
  });
});

// Pencil & Eraser
canvas.addEventListener('mousedown', e => {
  drawing = true;
  if(currentTool === 'pencil' || currentTool === 'eraser') {
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
  } else if(currentTool === 'bucket') {
    bucketFill(e.offsetX, e.offsetY, hexToRgb(currentColor));
  }
});
canvas.addEventListener('mousemove', e => {
  if(drawing && (currentTool === 'pencil' || currentTool === 'eraser')) {
    ctx.strokeStyle = currentTool === 'eraser' ? 'white' : currentColor;
    ctx.lineWidth = 4;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  }
});
canvas.addEventListener('mouseup', () => drawing = false);
canvas.addEventListener('mouseout', () => drawing = false);

// Bucket Fill
function bucketFill(x, y, fillColor) {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const targetColor = getPixel(imageData, x, y);
  if(colorsMatch(targetColor, fillColor)) return;
  const stack = [[x, y]];
  while(stack.length) {
    const [cx, cy] = stack.pop();
    const currentColorPixel = getPixel(imageData, cx, cy);
    if(colorsMatch(currentColorPixel, targetColor)) {
      setPixel(imageData, cx, cy, fillColor);
      stack.push([cx+1, cy],[cx-1, cy],[cx, cy+1],[cx, cy-1]);
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

function getPixel(imageData, x, y) {
  const index = (y * imageData.width + x) * 4;
  return [imageData.data[index], imageData.data[index+1], imageData.data[index+2], imageData.data[index+3]];
}

function setPixel(imageData, x, y, color) {
  const index = (y * imageData.width + x) * 4;
  imageData.data[index] = color[0];
  imageData.data[index+1] = color[1];
  imageData.data[index+2] = color[2];
  imageData.data[index+3] = 255;
}

function colorsMatch(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}

function hexToRgb(hex) {
  const c = document.createElement("div");
  c.style.color = hex;
  document.body.appendChild(c);
  const rgb = window.getComputedStyle(c).color.match(/\d+/g).map(Number);
  document.body.removeChild(c);
  return rgb;
}
