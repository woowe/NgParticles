
import { Behavior } from '../interfaces';
import { Particle } from './index';

export class Collision implements Behavior {
  particle_refs: Particle[];

  constructor() {}

  registerParticles(particles: Particle[]) {
    this.particle_refs = particles;
  }

  update() {
    for(var i = 0; i < this.particle_refs.length; ++i) {
      for(var j = 0; j < this.particle_refs.length; ++j) {
        if(j === i) { continue; }
        var dx = this.particle_refs[i].x - this.particle_refs[j].x;
        var dy = this.particle_refs[i].y - this.particle_refs[j].y;
        var dr = 10 + 10;
        if(dx * dx + dy * dy < dr * dr) {
          var p = this.particle_refs[j];
          var tmpVel = p.velocity;
          this.particle_refs[j].velocity = this.particle_refs[i].velocity;
          this.particle_refs[i].velocity = tmpVel;
          break;
        }
      }
    }

  }
}