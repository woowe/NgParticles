
import { Particle, Vector2 } from '../ParticleEngine/classes';
import { Behavior } from '../ParticleEngine/interfaces';

export class BoidRepel implements Behavior {
    particle_refs: Particle[];

    constructor() {}

    frobenius_norm(v: Vector2): number {
        return Math.sqrt(v.xMag * v.xMag + v.yMag * v.yMag);
    }

    registerParticles(particles: Particle[]) {
        this.particle_refs = particles;
    }

    update() {
        for(var i = 0; i < this.particle_refs.length; ++i) {
            var c = new Vector2(0, 0);
            for(var j = 0; j < this.particle_refs.length; ++j) {
                if(j !== i) {
                    var mag = this.frobenius_norm(this.particle_refs[i].pos.sub(this.particle_refs[j].pos));
                    if( mag < 100) {
                        var dpos = this.particle_refs[i].pos.sub(this.particle_refs[j].pos);
                        c.mutSub(dpos);
                    }
                }
            }
            this.particle_refs[i].velocity.mutAdd(c);
        }
    }
}