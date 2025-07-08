let running = false;
let canvas, ctx, overlay;

function convertToASCII(imageData) {
  const chars = "@%#*+=-:. ";
  const { data, width, height } = imageData;
  let ascii = "";
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const r = data[i], g = data[i+1], b = data[i+2];
      const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
      const idx = Math.floor((brightness / 255) * (chars.length - 1));
      ascii += chars[idx];
    }
    ascii += "\n";
  }
  return ascii;
}

function startASCII() {
  const video = document.querySelector('video');
  if (!video) return;
  canvas = document.createElement('canvas');
  ctx = canvas.getContext('2d');

  overlay = document.createElement('pre');
  overlay.id = 'ascii-overlay';
  Object.assign(overlay.style, {
    position: 'absolute', top: '0', left: '0',
    color: 'white', backgroundColor: 'black',
    fontFamily: 'monospace', fontSize: '6px',
    lineHeight: '6px', zIndex: '9999', pointerEvents: 'none'
  });
  document.body.appendChild(overlay);

  function render() {
    if (!running) return;
    canvas.width = 80;
    canvas.height = 60;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const ascii = convertToASCII(frame);
    overlay.textContent = ascii;
    requestAnimationFrame(render);
  }
  render();
}

window.addEventListener('toggle-ascii', () => {
  running = !running;
  if (running) {
    startASCII();
  } else {
    document.getElementById('ascii-overlay')?.remove();
  }
});