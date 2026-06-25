window.COIN_EXPLOSION = window.COIN_EXPLOSION || {};

window.COIN_EXPLOSION.ParticleSystem = class {
  constructor(app, SpineClass) {
    this.app = app;
    this.SpineClass = SpineClass;
    this.particles = [];
    this.settings = window.COIN_EXPLOSION.DEFAULT_SETTINGS;
  }

  clear() {
    for (const particle of this.particles) {
      this.app.stage.removeChild(particle.view);
      particle.view.destroy();
    }

    this.particles = [];
  }

  play(settings) {
    this.clear();
    this.settings = settings;

    const spineConfig = window.COIN_EXPLOSION.SPINE;
    const centerX = this.app.screen.width / 2;
    const centerY = this.app.screen.height / 2;

    for (let i = 0; i < settings.particleCount; i++) {
      const coin = this.SpineClass.from({
        skeleton: spineConfig.json,
        atlas: spineConfig.atlas
      });

      coin.x = centerX;
      coin.y = centerY;
      coin.alpha = settings.startOpacity;
      coin.scale.set(settings.startScale);
      coin.rotation = Math.random() * Math.PI * 2;

      coin.state.setAnimation(0, spineConfig.animation, true);

      const angle = Math.random() * Math.PI * 2;
      const randomAmount = 1 + ((Math.random() * 2 - 1) * settings.velocityRandomness);
      const speed = settings.velocity * randomAmount;

      this.particles.push({
        view: coin,
        age: 0,
        lifetime: settings.lifetime,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        gravity: settings.gravity,
        startScale: settings.startScale,
        endScale: settings.endScale,
        startOpacity: settings.startOpacity,
        endOpacity: settings.endOpacity,
        rotationSpeed: this.degToRad(settings.rotationSpeed)
      });

      this.app.stage.addChild(coin);
    }
  }

  update(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      p.age += dt;

      const progress = Math.min(p.age / p.lifetime, 1);

      p.vy += p.gravity * dt;
      p.view.x += p.vx * dt;
      p.view.y += p.vy * dt;

      p.view.scale.set(this.lerp(p.startScale, p.endScale, progress));
      p.view.alpha = this.lerp(p.startOpacity, p.endOpacity, progress);
      p.view.rotation += p.rotationSpeed * dt;

      if (p.age >= p.lifetime) {
        this.app.stage.removeChild(p.view);
        p.view.destroy();
        this.particles.splice(i, 1);
      }
    }

    if (this.particles.length === 0) {
      this.play(this.settings);
    }
  }

  lerp(a, b, t) {
    return a + (b - a) * t;
  }

  degToRad(degrees) {
    return degrees * Math.PI / 180;
  }
};