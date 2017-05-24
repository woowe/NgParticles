
import { Particle, Vector2 } from '../ParticleEngine/classes';
import { Behavior } from '../ParticleEngine/interfaces';

export class AveragePosition implements Behavior {
    particle_refs: Particle[];

    constructor() {}

   get_centre(): Vector2 {
        var centre = new Vector2(0, 0);
        for(var i = 0; i < this.particle_refs.length; ++i) {
            centre.mutAdd(this.particle_refs[i].pos);
        }
        return centre;
    }

    registerParticles(particles: Particle[]) {
        this.particle_refs = particles;
    }

    update() {
        var centre = this.get_centre();

        for(var i = 0; i < this.particle_refs.length; ++i) {
            var precieved_centre = centre.sub(this.particle_refs[i].pos);
            precieved_centre.scalarDiv(this.particle_refs.length - 1);
            precieved_centre.mutSub(this.particle_refs[i].pos)
            this.particle_refs[i].velocity.mutAdd( precieved_centre.scalarDiv(1000000) );
        }
    }
}