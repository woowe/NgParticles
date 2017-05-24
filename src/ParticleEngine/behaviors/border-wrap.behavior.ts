
import { Particle, Vector2 } from '../classes';
import { Behavior } from '../interfaces';

export class BorderWrapBehavior implements Behavior {
    particle_refs: Particle[];

    constructor() {}

    wall(p: Particle) {
        if(p.x + 20 < 0) {
            p.x = window.innerWidth + 20;
        }

        if(p.x - 20 > window.innerWidth) {
            p.x = -20;
        }

        if(p.y + 20 < 0) {
            p.y = window.innerHeight + 20;
        }

        if(p.y - 20 > window.innerHeight) {
            p.y = -20;
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