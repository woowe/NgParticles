
import { Particle } from '../classes';

export interface Behavior {
    apply(p: Particle);
}