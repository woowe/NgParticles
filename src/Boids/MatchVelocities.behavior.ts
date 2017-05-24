
import { Particle, Vector2 } from '../ParticleEngine/classes';
import { Behavior } from '../ParticleEngine/interfaces';

export class MatchVelocities implements Behavior {
    particle_refs: Particle[];

    constructor() {}

   get_avg_velocities(): Vector2 {
        var velocities = new Vector2(0, 0);
        for(var i = 0; i < this.particle_refs.length; ++i) {
            velocities.mutAdd(new Vector2(this.particle_refs[i].x, this.particle_refs[i].y));
        }
        return velocities;
    }

    registerParticles(particles: Particle[]) {
        this.particle_refs = particles;
    }

    update() {
        var tvel = this.get_avg_velocities();

        for(var i = 0; i < this.particle_refs.length; ++i) {
            var precieved_tvel = tvel.sub(this.particle_refs[i].velocity);
            precieved_tvel.scalarDiv(this.particle_refs.length - 1);
            precieved_tvel.mutSub(new Vector2(this.particle_refs[i].x, this.particle_refs[i].y))
            this.particle_refs[i].velocity.mutAdd( precieved_tvel.scalarDiv(100000) );
        }
    }
}