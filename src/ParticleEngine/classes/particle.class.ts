
import { Vector2 } from './index';

export class Particle {
    x: number;
    y: number;
    saveTo: {x: number, y: number};

    velocity: Vector2;

    /**
     * Creates an instance of Particle.
     * @param {number} [x=0] 
     * @param {number} [y=0] 
     * 
     * @memberOf Particle
     */
    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;

        this.velocity = new Vector2(Math.random() * 10, Math.random() * 10);
    }

    /**
     * Add a vector to the particle's velocity vector
     * 
     * @param {Vector2} v 
     * 
     * @memberOf Particle
     */
    addForce(v: Vector2) {
        this.velocity.mutAdd(v);
    }

    /**
     * Updates the position of the particle
     * 
     * 
     * @memberOf Particle
     */
    update() {
        this.x += this.velocity.xMag;
        this.y += this.velocity.yMag;
    }

    /**
     * Saves the particle's position to the saveTo object
     * 
     * 
     * @memberOf Particle
     */
    save() {
        this.saveTo.x = this.x;
        this.saveTo.y = this.y;
    }
}