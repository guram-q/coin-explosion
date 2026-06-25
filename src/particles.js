window.COIN_EXPLOSION = window.COIN_EXPLOSION || {};

window.COIN_EXPLOSION.ParticleSystem = class {
  constructor(app, SpineClass) {
    this.app = app;
    this.SpineClass = SpineClass;
    this.container = new PIXI.Container();
    this.app.stage.addChild(this.container);

    this.particles = [];
    this.settings = window.COIN_EXPLOSION.DEFAULT_SETTINGS;
  }

  clear() {
    for (const particle of this.particles) {
      particle.view.destroy();
    }

    this.container.removeChildren();
    this.particles = [];
  }

  play(settings) {
    this.clear();
    this.settings = settings;

    const spineConfig = window.COIN_EXPLOSION.SPINE;

    const emitX = this.app.screen.width / 2;
    const emitY = this.app.screen.height / 2;

    for (let i = 0; i < settings.particleCount; i++) {
      const particleSpine = this.SpineClass.from({
        skeleton: spineConfig.json,
        atlas: spineConfig.atlas
      });

      particleSpine.x = emitX;
      particleSpine.y = emitY;

      particleSpine.scale.set(settings.startScale);
      particleSpine.alpha = settings.startOpacity;

      const startRot = this.randomRange(-settings.rotation, settings.rotation);
      particleSpine.rotation = this.degToRad(startRot);

      particleSpine.state.setAnimation(0, spineConfig.animation, true);

      const angle = Math.random() * Math.PI * 2;

      const velocityMultiplier = this.randomRange(
        1 - settings.velocityRandomness,
        1 + settings.velocityRandomness
      );

      const speed = settings.velocity * velocityMultiplier;

      const particle = {
        view: particleSpine,

        age: 0,
        lifetime: settings.lifetime,

        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,

        gravity: settings.gravity,

        startScale: settings.startScale,
        endScale: settings.endScale,

        startOpacity: settings.startOpacity,
        endOpacity: settings.endOpacity,

        rotationSpeed: this.degToRad(
          this.randomRange(-settings.rotationSpeed, settings.rotationSpeed)
        )
      };

      this.particles.push(particle);
      this.container.addChild(particleSpine);
    }
  }

  update(dt) {
    if (this.particles.length === 0) {
      return;
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      p.age += dt;

      const progress = Math.min(p.age / p.lifetime, 1);

      p.vy += p.gravity * dt;

      p.view.x += p.vx * dt;
      p.view.y += p.vy * dt;

      const scale = this.lerp(p.startScale, p.endScale, progress);
      p.view.scale.set(scale);

      p.view.alpha = this.lerp(p.startOpacity, p.endOpacity, progress);
      p.view.rotation += p.rotationSpeed * dt;

      if (p.age >= p.lifetime) {
        p.view.destroy();
        this.particles.splice(i, 1);
      }
    }
  }

  lerp(a, b, t) {
    return a + (b - a) * t;
  }

  randomRange(min, max) {
    return min + Math.random() * (max - min);
  }

  degToRad(degrees) {
    return degrees * Math.PI / 180;
  }
};