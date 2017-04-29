
import { Particle, Vector2 } from './index';
import { Behavior } from '../interfaces';

export class EdgeBehavior implements Behavior {
    particle_refs: Particle[];

    constructor() {}

    wall(p: Particle) {
        if(p.x - 10 < 0) {
            p.x = 0 + 10;
            p.velocity.xMag *= -0.8;
        }

        if(p.x + 10 > window.innerWidth) {
            p.x = window.innerWidth - 10;
            p.velocity.xMag *= -0.8;
        }

        if(p.y - 10 < 0) {
            p.y = 0 + 10;
            p.velocity.yMag *= -0.8;
        }

        if(p.y + 10 > window.innerHeight) {
            p.y = window.innerHeight - 10;
            p.velocity.yMag *= -0.8;
        }
    }

    registerParticles(particles: Particle[]) {
        this.particle_refs = particles;
    }

    update() {
        for(var i = 0; i < this.particle_refs.length; ++i) {
            this.wall(this.particle_refs[i]);
        }
    }
}