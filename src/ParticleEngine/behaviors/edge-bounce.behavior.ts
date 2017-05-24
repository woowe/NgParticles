
import { Particle, Vector2 } from '../classes';
import { Behavior } from '../interfaces';

export class EdgeBehavior implements Behavior {
    particle_refs: Particle[];

    constructor() {}

    wall(p: Particle) {
        if(p.x < 0) {
            p.x = 0;
            p.velocity.xMag *= -0.8;
        }

        if(p.x + 20 > window.innerWidth) {
            p.x = window.innerWidth - 20;
            p.velocity.xMag *= -0.8;
        }

        if(p.y < 0) {
            p.y = 0;
            p.velocity.yMag *= -0.8;
        }

        if(p.y + 20 > window.innerHeight) {
            p.y = window.innerHeight - 20;
            p.velocity.yMag *= -0.8;
        }

        p.updatePos();
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