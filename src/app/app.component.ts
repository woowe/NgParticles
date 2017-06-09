import { Component, NgZone, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';

import * as PIXI from 'pixi.js';

import { ParticleEngine, Vector2, Particle, EdgeBehavior, BorderWrapBehavior, MouseRepelBehavior, Collision } from '../ParticleEngine';
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

    var number_of_particles = this.app.renderer instanceof PIXI.WebGLRenderer ? 550 : 100;
    var particlesContainer = new PIXI.particles.ParticleContainer(number_of_particles, {
      scale: true,
      position: true,
      rotation: true,
      uvs: true,
      alpha: true
    });

    let p_container = new PIXI.Container();

    let _particles = new ParticleEngine();
    let gravity = new Vector2(0, 9.8);
    // let wind = new Vector2(0.6, -0.4);
    var tendTo = new Vector2(window.innerWidth / 2, window.innerHeight / 2);
    // _particles.addForce(gravity);
    // _particles.addForce(wind);

    let mouse_pos = {x: 0, y: 0};

    var edgeBehavior = new EdgeBehavior();
    // var collision = new Collision();
    var borderWrap = new BorderWrapBehavior();
    var boid = new Boid(tendTo);
    var mouse_repel = new MouseRepelBehavior(mouse_pos);
    // _particles.addBehavior(boid);
    _particles.addBehavior(borderWrap);
    _particles.addBehavior(mouse_repel);
    // _particles.addBehavior(edgeBehavior);

    particlesContainer.interactive = true;
    particlesContainer.on('mousemove', (event) => {
      pmouseX = mouseX;
      pmouseY = mouseY;
      mouseX = event.data.global.x;
      mouseY = event.data.global.y;
      tendTo.xMag = mouseX;
      tendTo.yMag = mouseY;
      mouse_pos.x = mouseX;
      mouse_pos.y = mouseY;
      // tendTo.updatePos(mouseX, mouseY);
      // console.log('MOUSE MOVE', mouse_pos);
    });

    container.filterArea = new PIXI.Rectangle(0, 0, this.app.renderer.width, this.app.renderer.height);

    container.addChild(particlesContainer);
    container.addChild(p_container);
    var scale = 105;
    var graphics = new PIXI.Graphics();

    // graphics.lineStyle(1, 0xffffff, 1);
    graphics.beginFill(0xffffff);
    graphics.moveTo(0, 0);
    graphics.lineTo(2*scale, scale);
    graphics.lineTo(scale, 2*scale);
    // graphics.lineTo(2.5 * scale, 0);
    graphics.closePath();
    // graphics.beginFill(0xffffff);
    // graphics.drawRect(2 * scale * -1, 2 * scale * -1, 4 * scale, 4 * scale);
    // graphics.beginFill(0xffffff);
    // graphics.drawCircle(0, 0, scale);
    graphics.endFill();

    let texture = this.app.renderer.generateTexture(graphics, PIXI.settings.SCALE_MODE, 16/9);

    let mask_tex;
    let img_tex;
    let vid_tex;

    let loader = new PIXI.loaders.Loader();
    PIXI.loaders.Resource.setExtensionLoadType('mp4', PIXI.loaders.Resource.LOAD_TYPE.VIDEO);
    loader.add('five', '../assets/5.mp4');
    loader.add('michael', '../assets/michael.jpg');
    loader.add('zack', '../assets/zack.jpg');
    loader.add('mask', '../assets/mask.png');

    loader.load((loader, resources) => {
      img_tex = new PIXI.Texture.fromVideo(resources.five.data);
      img_tex = new PIXI.Texture.from(resources.michael.texture);
      // img_tex = new PIXI.Texture.from(resources.zack.texture);
      mask_tex = new PIXI.Texture.from(resources.mask.texture);

      let img_sprite = new PIXI.Sprite(img_tex);
      img_sprite.x = this.app.renderer.width / 2 - img_tex.width / 2;
      img_sprite.y = this.app.renderer.height / 2 - img_tex.height / 2;

      // let vid_sprite = new PIXI.Sprite(vid_tex);
      // vid_sprite.x = this.app.renderer.width / 2 - vid_tex.width / 2;
      // vid_sprite.y = this.app.renderer.height / 2 - vid_tex.height / 2;
      p_container.addChild(img_sprite);
    });

    loader.onComplete.add(() => {
      // let img_tex = PIXI.TextureCache('../assets/michael.jpg');

      console.log("LOADED", img_tex);

      // let m = new PIXI.Sprite.fromImage('../assets/mask.png');

      for(var i = 0; i < number_of_particles; ++i) {
        var rx = Math.random();
        var ry = Math.random();
        var x = rx * this.app.renderer.width;
        var y = ry * this.app.renderer.height;

        var c_x = rx * (img_tex.width - 2*scale);
        var c_y = ry * (img_tex.height - 2*scale);
        var c_w = img_tex.width - c_x;
        var c_h = img_tex.height - c_y;

        if(c_w <= 0 || c_h <= 0) {
          continue;
        }

        c_w = c_w > 2*scale ? 2*scale : c_w;
        c_h = c_h > 2*scale ? 2*scale : c_h;

        // console.log("RECT ",c_x, c_y, c_w, c_h);

        let frame = new PIXI.Rectangle(c_x, c_y, c_w , c_h);
        let src_tex = new PIXI.Texture(img_tex, frame);
        // let gen_tex = this.gen_text_with_mask(src_tex, graphics);

        // let gen_tex = this.app.renderer.generateTexture(src_tex, PIXI.settings.SCALE_MODE, 16/9);

        let tx = c_x + this.app.renderer.width / 2 - img_tex.width / 2;
        let ty = c_y + this.app.renderer.height / 2 - img_tex.height / 2;

        var sprite = new PIXI.Sprite(src_tex);
        var g = new PIXI.Sprite(texture);
        // g.position = sprite.position;
        sprite.x = tx;
        // sprite.x = x;
        sprite.y = ty;
        g.x = tx;
        g.y = ty;
        // sprite.y = y;

        // var rgb = hslToRgb(x % 360, 0.44, 0.56);
        // sprite.tint = rgb[0] << 16 | rgb[1] << 8 | rgb[0];
        // sprite.tint = Math.random() * 0xFFFFFF;
        sprite.mask = g;

        p_container.addChild(sprite);
        p_container.addChild(g);

        // particlesContainer.mask = mask_tex;

        let particle = new Particle(tx + sprite.width / 2, ty + sprite.height / 2);
        // let particle = new Particle(x, y);
        particle.saveTo = sprite.position;
        particle.sprite = sprite;
        // particle.scale = scale;

        _particles.addParticle(particle);
      }

      let cnt = 0;

      // setTimeout(() => {
        this.app.ticker.add((delta) => {
          // if(cnt > 200) {
            _particles.update(delta/50);
          // }
          cnt += delta;
        });
      // }, 2500);
    });
  }

  @HostListener('window:resize')
  webgl_scene_resize() {
    let {w_height, w_width} = {w_height: window.innerHeight, w_width: window.innerWidth};
    this.app.renderer.resize(w_width, w_height);
  }

  gen_text_with_mask(tex, mask) {
    let tempStage = new PIXI.Container();
    let s = new PIXI.Sprite(tex);
    // let m = new PIXI.Sprite.fromImage('../assets/mask.png');
    // s.x = 0;
    // s.y = 0;
    // m.x = 0;
    // m.y = 0;
    // m.width = s.width;
    // m.height = s.height;
    s.mask = mask;
    // tempStage.width = s.width;
    // tempStage.height = s.height;
    // tempStage.addChild(s);
    tempStage.addChild(mask);
    return this.app.renderer.generateTexture(tempStage, PIXI.settings.SCALE_MODE, 16/9);
  }
}
