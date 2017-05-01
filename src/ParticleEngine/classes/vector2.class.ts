
/**
 * Class that represents a 2D vector
 * 
 * @export
 * @class Vector2
 */
export class Vector2 {
    xMag: number;
    yMag: number;

    /**
     * Creates an instance of Vector2.
     * @param {number} [xMag=0] 
     * @param {number} [yMag=0] 
     * 
     * @memberOf Vector2
     */
    constructor(xMag: number = 0, yMag: number = 0) {
        this.xMag = xMag;
        this.yMag = yMag;
    }

    /**
     * Vector addition(s)
     * both addition by a vector and scalar
     * both either returns a new vector or mutates the current one
     */

    /**
     * Add this vector with another
     * 
     * @param {Vector2} v 
     * @returns {Vector2} 
     * 
     * @memberOf Vector2
     */
    add(v: Vector2): Vector2 {
        return new Vector2(
            this.xMag + v.xMag,
            this.yMag + v.yMag
        );
    }

    /**
     * Add this vector with another
     * 
     * @param {Vector2} v 
     * 
     * @memberOf Vector2
     */
    mutAdd(v: Vector2): void {
        this.xMag += v.xMag;
        this.yMag += v.yMag;
    }

    /**
     * Add this vector with a scalar value
     * 
     * @param {number} s 
     * @returns {Vector2} 
     * 
     * @memberOf Vector2
     */
    scalarAdd(s: number): Vector2 {
        return new Vector2(
            this.xMag + s,
            this.yMag + s
        );
    }

    /**
     * Add this vector with a scalar value
     * 
     * @param {number} s 
     * 
     * @memberOf Vector2
     */
    mutScalarAdd(s: number): void {
        this.xMag += s;
        this.yMag += s;
    }

    /**
     * Vector subtraction(s)
     * both subtraction by a vector and scalar
     * both either returns a new vector or mutates the current one
     */

    /**
     * Subtract this vector with another
     * 
     * @param {Vector2} v 
     * @returns {Vector2} 
     * 
     * @memberOf Vector2
     */
    sub(v: Vector2): Vector2 {
        return new Vector2(
            this.xMag - v.xMag,
            this.yMag - v.yMag
        );
    }

    /**
     * Subtract this vector with another
     * 
     * @param {Vector2} v 
     * 
     * @memberOf Vector2
     */
    mutSub(v: Vector2): void {
        this.xMag -= v.xMag;
        this.yMag -= v.yMag;
    }

    /**
     * Subtract this vector with a scalar
     * 
     * @param {number} s 
     * @returns {Vector2} 
     * 
     * @memberOf Vector2
     */
    scalarSub(s: number): Vector2 {
        return new Vector2(
            this.xMag - s,
            this.yMag - s
        );
    }

    /**
     * Subtract this vector with a scalar
     * 
     * @param {number} s 
     * 
     * @memberOf Vector2
     */
    mutScalarSub(s: number): void {
        this.xMag -= s;
        this.yMag -= s;
    }

    /**
     * Vector mulitplication(s)
     * both mulitplication by a vector and scalar
     * both either returns a new vector or mutates the current one
     */

    /**
     * Mulitply this vector with another
     * 
     * @param {Vector2} v 
     * @returns {Vector2} 
     * 
     * @memberOf Vector2
     */
    mult(v: Vector2): Vector2 {
        return new Vector2(
            this.xMag * v.xMag,
            this.yMag * v.yMag
        );
    }

    /**
     * Mulitply this vector with another
     * 
     * @param {Vector2} v 
     * 
     * @memberOf Vector2
     */
    mutMult(v: Vector2): void {
        this.xMag *= v.xMag;
        this.yMag *= v.yMag;
    }

    /**
     * Mulitply this vector by a scalar
     * 
     * @param {number} s 
     * @returns {Vector2} 
     * 
     * @memberOf Vector2
     */
    scalarMult(s: number): Vector2 {
        return new Vector2(
            this.xMag * s,
            this.yMag * s
        );
    }

    /**
     * Mulitply this vector by a scalar
     * 
     * @param {number} s 
     * 
     * @memberOf Vector2
     */
    mutScalarMult(s: number): void {
        this.xMag *= s;
        this.yMag *= s;
    }

    /**
     * Vector division(s)
     * both division by a vector and scalar
     * both either returns a new vector or mutates the current one
     */

    /**
     * Divide this vector by another
     * 
     * @param {Vector2} v 
     * @returns {Vector2} 
     * 
     * @memberOf Vector2
     */
    div(v: Vector2): Vector2 {
        return new Vector2(
            this.xMag / v.xMag,
            this.yMag / v.yMag
        );
    }

    /**
     * Divide this vector by another
     * 
     * @param {Vector2} v 
     * 
     * @memberOf Vector2
     */
    mutDiv(v: Vector2): void {
        this.xMag /= v.xMag;
        this.yMag /= v.yMag;
    }

    /**
     * Divide this vector by a scalar
     * 
     * @param {number} s 
     * @returns {Vector2} 
     * 
     * @memberOf Vector2
     */
    scalarDiv(s: number): Vector2 {
        return new Vector2(
            this.xMag / s,
            this.yMag / s
        );
    }

    /**
     * Divide this vector by a scalar
     * 
     * @param {number} s 
     * 
     * @memberOf Vector2
     */
    mutScalarDiv(s: number): void {
        this.xMag /= s;
        this.yMag /= s;
    }

    euclidianNorm() {
        return Math.sqrt(this.xMag * this.xMag + this.yMag * this.yMag);
    }
}