
import { Behavior } from '../interfaces';
import { Particle } from '../classes';

export class Collision implements Behavior {
  particle_refs: Particle[];

  constructor() {}

  registerParticles(particles: Particle[]) {
    this.particle_refs = particles;
  }

  update() {
    // for(var i = 0; i < this.particle_refs.length; ++i) {
    //   for(var j = 0; j < this.particle_refs.length; ++j) {
    //     if(j === i) { continue; }
    //     var dx = this.particle_refs[i].x - this.particle_refs[j].x;
    //     var dy = this.particle_refs[i].y - this.particle_refs[j].y;
    //     var dr = 10 + 10;
    //     if(dx * dx + dy * dy < dr * dr) {
    //       var theta = Math.atan2(dy, dx);
    //       var pVel = this.particle_refs[i].velocity.clone();
    //       var oVel = this.particle_refs[j].velocity.clone();

    //       // this.particle_refs[i].velocity.xMag = 2 * oVel.xMag * Math.cos(theta);
    //       // this.particle_refs[i].velocity.yMag = 2 * oVel.yMag * Math.sin(theta);
    //       // this.particle_refs[j].velocity.xMag = 2 * pVel.xMag * Math.cos(theta);
    //       // this.particle_refs[j].velocity.yMag = 2 * pVel.yMag * Math.sin(theta);
    //       break;
    //     }
    //   }
    // }

  }
}