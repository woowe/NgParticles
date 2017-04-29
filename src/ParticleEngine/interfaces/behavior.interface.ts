
import { Particle } from '../classes';

export interface Behavior {
    particle_refs: Particle[];
    registerParticles(particles: Particle[]);
    update();
}