import { Component, NgZone, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';

import * as PIXI from 'pixi.js';

import { ParticleEngine, Vector2, Particle, EdgeBehavior, BorderWrapBehavior, Collision } from '../ParticleEngine';
import { Boid } from '../Boids';
import { hslToRgb } from '../ParticleEngine/utils/utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
   @ViewChild('pixiScene') pixiScene: ElementRef;

  app: any;

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular( () => this.webgl_stuff() );
  }

  webgl_stuff() {
    // The application will create a renderer using WebGL, if possible,
    // with a fallback to a canvas render. It will also setup the ticker
    // and the root stage PIXI.Container.
    this.app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      antialias: true
    });

    // The application will create a canvas element for you that you
    // can then insert into the DOM.
    this.pixiScene.nativeElement.appendChild(this.app.view);

    var container = new PIXI.Container();

    this.app.stage.addChild(container);

    var translateX = window.innerWidth / 2;
    var translateY = window.innerHeight / 2;

    var mouseX = 0;
    var mouseY = 0;
    var pmouseX = 0;
    var pmouseY = 0;

    var number_of_particles = this.app.renderer instanceof PIXI.WebGLRenderer ? 1000 : 100;
    var particlesContainer = new PIXI.particles.ParticleContainer(number_of_particles, {
      scale: true,
      position: true,
      rotation: true,
      uvs: true,
      alpha: true
    });

    let _particles = new ParticleEngine();
    let gravity = new Vector2(0, 9.8);
    let wind = new Vector2(0, 0);
    var tendTo = new Vector2(window.innerWidth / 2, window.innerHeight / 2);
    // _particles.addForce(gravity);
    // _particles.addForce(wind);

    var edgeBehavior = new EdgeBehavior();
    // var collision = new Collision();
    var borderWrap = new BorderWrapBehavior();
    var boid = new Boid(tendTo);
    _particles.addBehavior(boid);
    _particles.addBehavior(borderWrap);

    particlesContainer.interactive = true;
    particlesContainer.on('mousemove', (event) => {
      pmouseX = mouseX;
      pmouseY = mouseY;
      mouseX = event.data.global.x;
      mouseY = event.data.global.y;
      tendTo.xMag = mouseX;
      tendTo.yMag = mouseY;
      // tendTo.updatePos(mouseX, mouseY);
      // console.log('MOUSE MOVE', tendTo.pos);
    });

    container.filterArea = new PIXI.Rectangle(0, 0, this.app.renderer.width, this.app.renderer.height);
    
    container.addChild(particlesContainer);
    var scale = 2;
    var graphics = new PIXI.Graphics();
    // graphics.beginFill(0x5588aa);
    graphics.lineStyle(1, 0xffffff, 1);
    graphics.moveTo(2.5 * scale, 0);
    graphics.lineTo(5 * scale, 8 * scale);
    graphics.lineTo(0, 8 * scale);
    graphics.lineTo(2.5 * scale, 0);
    graphics.closePath();
    // graphics.drawCircle(2.5 * scale, 4.1225 * scale, 2 * scale);
    // graphics.endFill();

    let texture = this.app.renderer.generateTexture(graphics, PIXI.settings.SCALE_MODE, 16/9);

    for(var i = 0; i < number_of_particles; ++i) {
      var x = Math.random() * this.app.renderer.width;
      var y = Math.random() * this.app.renderer.height;

      var sprite = new PIXI.Sprite(texture);
      sprite.x = x;
      sprite.y = y;

      var rgb = hslToRgb(x % 360, 0.44, 0.56);
      // sprite.tint = rgb[0] << 16 | rgb[1] << 8 | rgb[0];
      sprite.tint = Math.random() * 0xFFFFFF;

      particlesContainer.addChild(sprite);

      let particle = new Particle(x, y);
      particle.saveTo = sprite.position;
      particle.sprite = sprite;
      particle.scale = scale;

      _particles.addParticle(particle);
    }

    this.app.ticker.add((delta) => {
      _particles.update(delta/50);
    });

    
  }

  @HostListener('window:resize')
  webgl_scene_resize() {
    let {w_height, w_width} = {w_height: window.innerHeight, w_width: window.innerWidth};
    this.app.renderer.resize(w_width, w_height);
  }
}
