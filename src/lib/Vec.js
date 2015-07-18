

export default class Vec {
  x = 0;
  y = 0;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  add(other) {
    return new Vec(this.x + other.x, this.y + other.y);
  }

  subtract(other) {
    return new Vec(this.x - other.x, this.y - other.y);
  }

  magnitudeSquared() {
    var {x, y} = this;
    return x*x + y*y;
  }

  magnitude() {
    return Math.sqrt(this.magnitudeSquared());
  }

  scale(magnitude) {
    return new Vec(this.x * magnitude, this.y * magnitude);
  }

  dot(other) {
    return this.x * other.x + this.y * other.y;
  }

  normalize() {
    return this.scale(1/this.magnitude());
  }

}
