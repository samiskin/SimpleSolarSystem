
var G = 0.0667384; // e-11

import Vec from 'Vec';


var bodyCount = 0;

var restitution = 0.2;


export default class Body{
    mass = 0;
    radius = 0;
    pos = new Vec();
    vel = new Vec();
    accel = new Vec();
    id = 0;

    constructor(mass = 0, radius = 0, pos = new Vec(), vel = new Vec(), accel = new Vec()) {
      this.mass = mass;
      this.radius = radius;
      this.pos = pos;
      this.vel = vel;
      this.accel = accel;
      this.id = bodyCount;
      bodyCount = bodyCount + 1;
    }

    static merge(b1, b2) {
      return new Body(
        b1.mass + b2.mass,
        b1.radius + b2.radius,
        b1.pos.add(b2.pos).scale(0.5),
        b1.vel.add(b2.vel),
        b1.accel.add(b2.accel)
      );
    }

    intersects(other) {
      var minDist = this.radius + other.radius;
      return (this.pos.subtract(other.pos)).magnitude() < minDist;
    }


    gravitate(other) {
    }

    interact(other) {
      if (this.id == other.id)
        return;

      var diff = this.pos.subtract(other.pos);

      var e = 2;
      var scale = -G * this.mass * other.mass / Math.pow(diff.magnitudeSquared() + e*e, 1.5);
      var force = diff.normalize().scale(scale);

      this.accel = this.accel.add(force);
    }

    tick() {
      this.vel = this.vel.add(this.accel);
      this.pos = this.pos.add(this.vel);
    }

    render(ctx) {
      var { pos, radius } = this;

      ctx.save();
      ctx.fillStyle = 'rgba(0,155,255,0.4)';
      ctx.translate(pos.x, pos.y);
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, 2*Math.PI);
      ctx.fill();
      ctx.restore();

    }


}
