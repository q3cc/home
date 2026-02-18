import { mainStore } from "@/store";
import { detectDeviceType } from "@/utils/device";
let animationFrameId: number | null = null;
let canvas: HTMLCanvasElement | null = null;
let fireflyCount: number = 0;
let lastFrameTime = 0;
const targetFrameInterval = 1000 / 30;
const fireflies: {
  x: number;
  y: number;
  opacity: number;
  speedX: number;
  speedY: number;
  radius: number;
}[] = [];

const resizeCanvas = () => {
  if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
};

const createCanvas = () => {
  if (canvas) return;
  canvas = document.createElement('canvas');
  canvas.id = 'fireflyCanvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '0';
  canvas.style.willChange = 'transform';
  document.body.appendChild(canvas);
};

const initFirefly = () => {
  const store = mainStore();
  store.showFirefly = true;
  if (animationFrameId) {
    closeFirefly();
  };
  createCanvas();
  const ctx = canvas?.getContext('2d');
  if (!ctx || !canvas) return;
  const createFireflies = () => {
    fireflies.length = 0;
    const deviceType = detectDeviceType();
    if (deviceType === 'mobile') {
      fireflyCount = 24;
    } else {
      fireflyCount = 48;
    };
    for (let i = 0; i < fireflyCount; i++) {
      fireflies.push({
        x: Math.random() * canvas!.width,
        y: Math.random() * canvas!.height,
        opacity: Math.random(),
        speedX: Math.random() * 1.2 - 0.35,
        speedY: Math.random() * 1.2 - 0.35,
        radius: Math.random() * 2 + 1,
      });
    }
  };

  const drawFireflies = () => {
    ctx.clearRect(0, 0, canvas!.width, canvas!.height);
    ctx.fillStyle = 'rgba(255, 255, 0, 0.8)';
    ctx.beginPath();
    fireflies.forEach((firefly) => {
      ctx.moveTo(firefly.x, firefly.y);
      ctx.arc(firefly.x, firefly.y, firefly.radius, 0, Math.PI * 2, true);
    });
    ctx.fill();
    moveFireflies();
  };

  const moveFireflies = () => {
    fireflies.forEach((firefly) => {
      firefly.x += firefly.speedX;
      firefly.y += firefly.speedY;
      if (firefly.x > canvas!.width || firefly.x < 0) {
        firefly.speedX *= -1;
      };
      if (firefly.y > canvas!.height || firefly.y < 0) {
        firefly.speedY *= -1;
      };
    });
  };

  const updateFireflies = (timestamp?: number) => {
    const now = timestamp ?? performance.now();
    if (now - lastFrameTime >= targetFrameInterval) {
      lastFrameTime = now;
      drawFireflies();
    }
    animationFrameId = requestAnimationFrame(updateFireflies);
  };

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  createFireflies();
  lastFrameTime = 0;
  updateFireflies();
};

const closeFirefly = () => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  };
  if (canvas && canvas.parentNode === document.body) {
    document.body.removeChild(canvas);
    canvas = null;
  };
  fireflies.length = 0;
  window.removeEventListener('resize', resizeCanvas);
  const store = mainStore();
  store.showFirefly = false;
};

export { initFirefly, closeFirefly };
