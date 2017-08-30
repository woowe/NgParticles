
import { Particle, Vector2 } from '../classes';
import { Behavior } from '../interfaces';

import { hslToRgb } from '../utils/utils';

export class MouseRepelBehavior implements Behavior {
    particle_refs: Particle[];

    inital_pos: {x: number, y: number}[] = [];
    mouse_pos: {x: number, y: number};

    p_repel_force: Vector2 = new Vector2(0, 0);
    p_attract_force: Vector2 = new Vector2(0, 0);

    constructor(mouse_pos: {x: number, y: number}) {
      this.mouse_pos = mouse_pos;
    }

    registerParticles(particles: Particle[]) {
        this.particle_refs = particles;
    }

    dist(pos0, pos1) {
      // console.log("DIST", pos0, pos1);
      return Math.sqrt((pos1.x - pos0.x) * (pos1.x - pos0.x) + (pos1.y - pos0.y) * (pos1.y - pos0.y));
    }

    update() {
        if(this.inital_pos.length === 0) {
          // console.log("PARTICLES", this.particle_refs);
          for(var i = 0; i < this.particle_refs.length; ++i) {
            this.inital_pos.push({x: this.particle_refs[i].x, y: this.particle_refs[i].y});
          }
        }

        for(let i = 0; i < this.particle_refs.length; ++i) {
          var ipos = this.inital_pos[i];
          var md = this.dist(this.mouse_pos, {x: this.particle_refs[i].x, y: this.particle_refs[i].y}) + 1e-10;
          // if(d < 200) {
          // var a = Math.atan2(ipos.y - this.mouse_pos.y, ipos.x - this.mouse_pos.x);
          // var tx = ipos.x;
          // var ty = ipos.y;
          var tx = (this.mouse_pos.x - ipos.x) * 1/md * 1/md * 1/md * 1/md/*(Math.cos(a) * d)*/;
          var ty = (this.mouse_pos.y - ipos.y) * 1/md * 1/md * 1/md * 1/md/*(Math.sin(a) * d)*/;

          let repel_force = new Vector2(tx, ty).scalarMult(-90000);

          repel_force.limit(5);

          // this.particle_refs[i].velocity.mutSub(this.p_repel_force);
          this.particle_refs[i].velocity.mutAdd(repel_force);

          this.p_repel_force = repel_force;

          var nx = this.particle_refs[i].velocity.xMag + this.particle_refs[i].x;
          var ny = this.particle_refs[i].velocity.yMag + this.particle_refs[i].y;

          var id = this.dist({x: nx, y: ny}, ipos) + 1e-10;
          var itx = nx - ipos.x/*(Math.cos(a) * d)*/;
          var ity = ny - ipos.y/*(Math.sin(a) * d)*/;

          // itx *= itx;
          // ity *= ity;

          let attract_force = new Vector2(itx, ity).scalarMult(-(id/150));

          let inv_attract_force = attract_force.scalarMult(-(1/id * 1/id));

          attract_force.limit(17);
          // inv_attract_force.limit(17);

          // this.particle_refs[i].velocity.mutSub(this.p_attract_force);
          this.particle_refs[i].velocity.mutAdd(attract_force);
          this.particle_refs[i].velocity.mutAdd(inv_attract_force);

          this.p_attract_force = attract_force;

          // if(md > 200) {
          //   this.particle_refs[i].x = ipos.x;
          //   this.particle_refs[i].y = ipos.y;
          // }
        }
    }
}
