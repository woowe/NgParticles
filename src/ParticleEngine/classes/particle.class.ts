
import { Vector2 } from './index';

export class Particle {
    x: number;
    y: number;
    saveTo: {x: number, y: number};
    sprite: any;
    scale: number;

    velocity: Vector2;
    pos: Vector2;
    cx: number = 0;
    cy: number = 0;

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

        // this.velocity = new Vector2(Math.floor(Math.random() * 12) - 6, Math.floor(Math.random() * 12) - 6);
        this.velocity = new Vector2(0, 0);
        this.pos = new Vector2(this.x, this.y);
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
        this.pos.add(this.velocity);
        this.x += this.velocity.xMag;
        this.y += this.velocity.yMag;
    }

    updatePos() {
        this.pos.xMag = this.x;
        this.pos.yMag = this.y;
    }

    /**
     * Saves the particle's position to the saveTo object
     *
     *
     * @memberOf Particle
     */
    save() {
        if(!this.cx) {
            this.cx = this.sprite.width / 2;
        }

        if(!this.cy) {
            this.cy = this.sprite.height / 2;
        }

        // this.cx = this.cy = 0;
        this.saveTo.x = this.x - this.cx;
        this.saveTo.y = this.y - this.cy;

        if(this.sprite.mask) {
          this.sprite.mask.x = this.x - this.cx;
          this.sprite.mask.y = this.y - this.cy;
        }
        // this.sprite.pivot.x = this.x + this.cx;
        // this.sprite.pivot.y = this.y + this.cy;
        // this.sprite.rotation = -Math.PI / 2;
        // this.sprite.rotation = this.velocity.heading() + Math.PI / 2;
    }
}
