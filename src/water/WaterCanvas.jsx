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
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      physics = new WaterPhysics(canvas.width, canvas.height, 5);
    };

    resize();
    window.addEventListener('resize', resize);

    const interact = (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX ?? event.touches[0].clientX) - rect.left;
      const y = (event.clientY ?? event.touches[0].clientY) - rect.top;
      physics.disturb(x, y);
    };

    canvas.addEventListener('pointermove', interact);
    canvas.addEventListener('pointerdown', interact);

    const draw = () => {
      physics.update();

      const image = ctx.createImageData(canvas.width, canvas.height);
      const data = image.data;

      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const i = (y * canvas.width + x) * 4;
          const wave = physics.current[
            Math.min(physics.rows - 1, Math.floor(y / physics.resolution)) * physics.cols +
            Math.min(physics.cols - 1, Math.floor(x / physics.resolution))
          ] || 0;

          data[i] = 0;
          data[i + 1] = 70 + wave * 0.4;
          data[i + 2] = 150 + wave * 0.8;
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
