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

    for (let y = -6; y <= 6; y++) {
      for (let x = -6; x <= 6; x++) {
        const px = cx + x;
        const py = cy + y;

        if (px < 0 || py < 0 || px >= this.cols || py >= this.rows) continue;

        const distance = Math.sqrt(x * x + y * y);
        if (distance < 6) {
          this.current[py * this.cols + px] += strength * (1 - distance / 6);
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

        next[i] *= 0.985;
      }
    }

    [this.current, this.previous] = [this.previous, this.current];
  }
}
