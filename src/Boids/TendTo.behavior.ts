
import { Particle, Vector2 } from '../ParticleEngine/classes';
import { Behavior } from '../ParticleEngine/interfaces';

export class TendTo implements Behavior {
    particle_refs: Particle[];
    pos: Vector2;

    constructor(x: number, y: number) {
        this.pos = new Vector2(x, y);
    }

    registerParticles(particles: Particle[]) {
        this.particle_refs = particles;
    }

    updatePos(x: number, y: number) {
        this.pos = new Vector2(x, y);
    }

    update() {
        for(var i = 0; i < this.particle_refs.length; ++i) {
            var precieved_centre = this.pos.sub(this.particle_refs[i].pos);
            precieved_centre.scalarDiv(this.particle_refs.length - 1);
            this.particle_refs[i].velocity.mutAdd( precieved_centre.scalarDiv(1000) );
        }
    }
}