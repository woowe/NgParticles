
import { Particle, Vector2 } from './index';
import { Behavior } from '../interfaces';

export class EdgeBehavior implements Behavior {
    constructor() {}

    apply(p: Particle) {
        if(p.x < 0) {
            p.x = 0 + 10;
            p.velocity.xMag *= -0.8;
        }

        if(p.x > window.innerWidth) {
            p.x = window.innerWidth - 10;
            p.velocity.xMag *= -0.8;
        }

        if(p.y < 0) {
            p.y = 0 + 10;
            p.velocity.yMag *= -0.8;
        }

        if(p.y > window.innerHeight) {
            p.y = window.innerHeight - 10;
            p.velocity.yMag *= -0.8;
        }
    }
}