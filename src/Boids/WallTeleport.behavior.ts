
import { Particle, Vector2 } from '../ParticleEngine/classes';
import { Behavior } from '../ParticleEngine/interfaces';

export class WallTeleport implements Behavior {
    particle_refs: Particle[];

    constructor() {}

    wall(p: Particle) {
        if(p.x + 10 < 0) {
            p.x = 410;
        }

        if(p.x - 10 > window.innerWidth) {
            p.x = -10;
        }

        if(p.y + 10 < 0) {
            p.y = 410;
        }

        if(p.y - 10 > window.innerHeight) {
            p.y = -10;
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