
import { Particle, Vector2 } from '../ParticleEngine/classes';
import { Behavior } from '../ParticleEngine/interfaces';

export class Boid implements Behavior {
    particle_refs: Particle[];
    tendToPos: Vector2;
    max_speed: number;
    max_force: number;
    constructor(tendTo: Vector2, max_speed: number = 2, max_force: number = 0.03) {
        this.tendToPos = tendTo;
        this.max_speed = max_speed;
        this.max_force = max_force;
    }

    vec_mag(v: Vector2): number {
        return Math.sqrt(v.xMag * v.xMag + v.yMag * v.yMag);
    }
    
    constrain_mag(v: Vector2, mag_lim: number) {
        var mag = v.magnitude();

        if(mag > mag_lim) {
            v.mutScalarDiv(mag);
            v.mutScalarMult(mag_lim);
        }
    }

    seek(p: Particle, target: Vector2): Vector2 {
        var desired = target.sub(p.pos);
        desired.mutNormalize();
        desired.mutScalarMult(this.max_speed);

        var steer = desired.sub(p.velocity);
        this.constrain_mag(steer, this.max_force);

        return steer;
    }

    seperate(p: Particle, idx: number): Vector2 {
        var desired_seperation = 25;
        var steer = new Vector2(0, 0);
        var count = 0;
        for(var i = 0; i < this.particle_refs.length; ++i) {
            if(i !== idx) {
                var other = this.particle_refs[i];
                var dist = p.pos.dist(other.pos);
                if(dist < desired_seperation) {
                    var diff = p.pos.sub(other.pos);
                    diff.mutNormalize();
                    diff.mutScalarDiv(dist);
                    diff.mutScalarMult(1 + 1/dist * 2);
                    steer.mutAdd(diff);
                    ++count;
                }
            }
        }

        if(count > 0) {
            steer.mutScalarDiv(count);
        }

        if(steer.magnitude() > 0) {
            steer.mutNormalize();
            steer.mutScalarMult(this.max_speed);
            steer.mutSub(p.velocity);
            this.constrain_mag(steer, this.max_force);
        }

        return steer;
    }

    align(p: Particle, idx: number): Vector2 {
        var neighbor_dist = 50;
        var sum = new Vector2(0, 0);
        var count = 0;
        for(var i = 0; i < this.particle_refs.length; ++i) {
            if(i !== idx) {
                var other = this.particle_refs[i];
                var dist = p.pos.dist(other.pos);
                if(dist < neighbor_dist) {
                    sum.mutAdd(other.velocity);
                    count++;
                }
            }
        }
        
        if(count > 0) {
            sum.mutScalarDiv(count);

            sum.mutNormalize();
            sum.mutScalarMult(this.max_speed);
            var steer = sum.sub(p.velocity);
            this.constrain_mag(steer, this.max_force);
            return steer;
        } else {
            return new Vector2(0, 0);
        }
    }

    cohesion(p: Particle, idx: number): Vector2 {
        var neighbor_dist = 50;
        var sum = new Vector2(0, 0);
        var count = 0;
        for(var i = 0; i < this.particle_refs.length; ++i) {
            if(i !== idx) {
                var other = this.particle_refs[i];
                var dist = p.pos.dist(other.pos);
                if(dist < neighbor_dist) {
                    sum.mutAdd(other.pos);
                    count++;
                }
            }
        }
        
        if(count > 0) {
            sum.mutScalarDiv(count);
            return this.seek(p, sum);
        } else {
            return new Vector2(0, 0);
        }
    }

    registerParticles(particles: Particle[]) {
        this.particle_refs = particles;
    }

    attractor(p: Particle) {
        var dist = p.pos.dist(this.tendToPos);
        var max_dist = window.innerWidth > window.innerHeight ? window.innerWidth : window.innerHeight;
        var max_dist = 400;
        if(dist > 0 && dist < max_dist) {
            var desired = this.tendToPos.sub(p.pos);
            desired.mutNormalize();
            var idist = 1/dist;
            var inv_dist = -Math.cos((Math.PI * 2)/(idist)/(max_dist)) / 5;
            var a = 0;
            if(inv_dist < 2) {
                a = 1 + idist;
            }
            var dist_factor = (inv_dist * this.max_speed);
            desired.mutScalarMult(this.max_speed * dist_factor);
            // var dist_factor = (inv_dist * this.max_force);
            var steer = desired.sub(p.velocity).scalarMult(a * 6);
            this.constrain_mag(steer, this.max_force);

            return steer;
        }
        return new Vector2(0, 0);
    }

    update() {
        var m1 = 1.5;
        var m2 = 1;
        var m3 = 0.6;
        var m4 = 3;
        for(var i = 0; i < this.particle_refs.length; ++i) {
            var v = new Vector2(0, 0);
            v.mutAdd(this.seperate(this.particle_refs[i], i).scalarMult(m1));
            v.mutAdd(this.align(this.particle_refs[i], i).scalarMult(m2));
            v.mutAdd(this.cohesion(this.particle_refs[i], i).scalarMult(m3));
            // v.mutAdd(this.attractor(this.particle_refs[i]).scalarMult(m4));
            this.particle_refs[i].velocity.mutAdd(v);
            this.constrain_mag(this.particle_refs[i].velocity, this.max_speed);
        }
    }
}