export class WaterPhysics {
  constructor(width, height, resolution = 4) {
    this.resolution = resolution;
    this.cols = Math.floor(width / resolution);
    this.rows = Math.floor(height / resolution);

    this.current = new Float32Array(this.cols * this.rows);
    this.previous = new Float32Array(this.cols * this.rows);
  }

  disturb(x, y, strength = 120) {
    const cx = Math.floor(x / this.resolution);
    const cy = Math.floor(y / this.resolution);
    const radius = 8;

    for (let yy = -radius; yy <= radius; yy++) {
      for (let xx = -radius; xx <= radius; xx++) {
        const px = cx + xx;
        const py = cy + yy;
        if (px < 0 || py < 0 || px >= this.cols || py >= this.rows) continue;

        const distance = Math.sqrt(xx * xx + yy * yy);
        if (distance < radius) {
          const falloff = Math.cos((distance / radius) * Math.PI * 0.5);
          this.current[py * this.cols + px] += strength * falloff;
        }
      }
    }
  }

  update() {
    const next = this.previous;

    for (let y = 1; y < this.rows - 1; y++) {
      for (let x = 1; x < this.cols - 1; x++) {
        const i = y * this.cols + x;

        next[i] = (
          this.current[i - 1] +
          this.current[i + 1] +
          this.current[i - this.cols] +
          this.current[i + this.cols]
        ) / 2 - this.previous[i];

        next[i] *= 0.988;
      }
    }

    [this.current, this.previous] = [this.previous, this.current];
  }
}
