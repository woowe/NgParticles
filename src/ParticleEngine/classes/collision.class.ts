
import { Behavior } from '../interfaces';
import { Particle } from './index';

export class Collision implements Behavior {
  particle_refs: Particle[];

  constructor() {}

  registerParticles(particles: Particle[]) {
    this.particle_refs = particles;
  }

  update() {
    
  }
}