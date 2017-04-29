
import { Vector2, Particle } from './index';
import { Behavior } from '../interfaces';

export class ParticleEngine {
    netForce: Vector2 = new Vector2();
    particles: Particle[] = [];
    behaviors: Behavior[] = [];

    /**
     * Creates an instance of ParticleEngine.
     * 
     * @memberOf ParticleEngine
     */
    constructor() {}

    /**
     * Add a force to the net force for all particles
     * 
     * @param {Vector2} v 
     * 
     * @memberOf ParticleEngine
     */
    addForce(v: Vector2) {
        this.netForce.mutAdd(v);
    }

    /**
     * Adds a particle to the system
     * 
     * @param {Particle} p 
     * 
     * @memberOf ParticleEngine
     */
    addParticle(p: Particle) {
        this.particles.push(p);
    }

    addBehavior(b: Behavior) {
        b.registerParticles(this.particles);
        this.behaviors.push(b);
    }

    getParticle(idx: number) {
        return this.particles[idx];
    }

    /**
     * Update all particles
     * 
     * @param {any} delta 
     * 
     * @memberOf ParticleEngine
     */
    update(delta) {
        let netVec = this.netForce.scalarMult(delta);

        // clacs
        for(var i = 0; i < this.particles.length; ++i) {
            this.particles[i].addForce(netVec);
            this.particles[i].update();
        }

        if(this.behaviors.length > 0) {
            for(var i = 0; i < this.behaviors.length; ++i) {
                this.behaviors[i].update();
            }
        }

        // save
        for(var i = 0; i < this.particles.length; ++i) {
            this.particles[i].save();
        }
    }
}