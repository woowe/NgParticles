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

    var number_of_particles = this.app.renderer instanceof PIXI.WebGLRenderer ? 5000 : 100;
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
    // _particles.addBehavior(boid);
    // _particles.addBehavior(borderWrap);
    _particles.addBehavior(edgeBehavior);

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
    var scale = 10;
    var graphics = new PIXI.Graphics();
    
    // graphics.lineStyle(1, 0xffffff, 1);
    // graphics.moveTo(2.5 * scale, 0);
    // graphics.lineTo(5 * scale, 8 * scale);
    // graphics.lineTo(0, 8 * scale);
    // graphics.lineTo(2.5 * scale, 0);
    // graphics.closePath();
    graphics.beginFill(0x8bc5ff);
    graphics.drawRect(2 * scale * -1, 2 * scale * -1, 4 * scale, 4 * scale);
    // graphics.beginFill(0xffffff);
    // graphics.drawCircle(0, 0, 2 * scale);
    graphics.endFill();

    let texture = this.app.renderer.generateTexture(graphics, PIXI.settings.SCALE_MODE, 16/9);

    let mask_tex;
    let michael_tex;

    let loader = new PIXI.loaders.Loader();
    loader.add('michael', '../assets/michael.jpg');
    loader.add('mask', '../assets/mask.png');

    loader.load((loader, resources) => {
      michael_tex = new PIXI.Texture.from(resources.michael.texture);
      mask_tex = new PIXI.Texture.from(resources.mask.texture);
    });
    
    loader.onComplete.add(() => {
      // let michael_tex = PIXI.TextureCache('../assets/michael.jpg');

      console.log("LOADED", michael_tex);

      for(var i = 0; i < number_of_particles; ++i) {
        var rx = Math.random();
        var ry = Math.random();
        var x = rx * this.app.renderer.width;
        var y = ry * this.app.renderer.height;

        var c_x = rx * michael_tex.width;
        var c_y = ry * michael_tex.height;
        var c_w = michael_tex.width - c_x;
        var c_h = michael_tex.height - c_y;

        if(c_w <= 0 || c_h <= 0) {
          continue;
        }

        c_w = c_w > 2*scale ? 2*scale : c_w;
        c_h = c_h > 2*scale ? 2*scale : c_h;

        console.log("RECT ",c_x, c_y, c_w, c_h);

        let frame = new PIXI.Rectangle(c_x, c_y, c_w , c_h);
        let src_tex = new PIXI.Texture(michael_tex, frame);
        
        var sprite = new PIXI.Sprite(src_tex);
        sprite.x = x;
        sprite.y = y;

        // var rgb = hslToRgb(x % 360, 0.44, 0.56);
        // sprite.tint = rgb[0] << 16 | rgb[1] << 8 | rgb[0];
        // sprite.tint = Math.random() * 0xFFFFFF;
        sprite.mask = mask_tex;

        particlesContainer.addChild(sprite);

        particlesContainer.mask = mask_tex;

        let particle = new Particle(x, y);
        particle.saveTo = sprite.position;
        particle.sprite = sprite;
        // particle.scale = scale;

        _particles.addParticle(particle);
      }

      this.app.ticker.add((delta) => {
        _particles.update(delta/50);
      });
    });
  }

  @HostListener('window:resize')
  webgl_scene_resize() {
    let {w_height, w_width} = {w_height: window.innerHeight, w_width: window.innerWidth};
    this.app.renderer.resize(w_width, w_height);
  }
}
