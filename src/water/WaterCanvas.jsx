import { useEffect, useRef } from 'react';
import { WaterPhysics } from './WaterPhysics';

export default function WaterCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let physics;
    let animation;

    const resize = () => {
      canvas.width = Math.floor(window.innerWidth);
      canvas.height = Math.floor(window.innerHeight);
      physics = new WaterPhysics(canvas.width, canvas.height, 4);
    };

    resize();
    window.addEventListener('resize', resize);

    let last = null;
    const interact = (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const force = last ? Math.min(35, Math.hypot(x - last.x, y - last.y) * 2) : 18;
      physics.disturb(x, y, force);
      last = { x, y };
    };

    canvas.addEventListener('pointermove', interact);
    canvas.addEventListener('pointerdown', interact);
    canvas.addEventListener('pointerup', () => last = null);

    const draw = () => {
      physics.update();
      const image = ctx.createImageData(canvas.width, canvas.height);
      const data = image.data;

      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const gx = Math.floor(x / physics.resolution);
          const gy = Math.floor(y / physics.resolution);
          const wave = physics.current[Math.min(physics.rows - 1, gy) * physics.cols + Math.min(physics.cols - 1, gx)] || 0;

          const light = 8 * Math.sin(x * 0.01 + y * 0.006) + wave * 1.8;
          const i = (y * canvas.width + x) * 4;

          data[i] = 2 + Math.max(0, light);
          data[i + 1] = 55 + light + wave * 0.4;
          data[i + 2] = 125 + light * 2 + wave;
          data[i + 3] = 255;
        }
      }

      ctx.putImageData(image, 0, 0);
      animation = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animation);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="water" />;
}
