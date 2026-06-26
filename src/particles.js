window.COIN_EXPLOSION = window.COIN_EXPLOSION || {};

window.COIN_EXPLOSION.ParticleSystem = class {
  constructor(app, SpineClass) {
    this.app = app;
    this.SpineClass = SpineClass;

    this.world = new PIXI.Container();
    this.container = new PIXI.Container();

    this.world.addChild(this.container);
    this.app.stage.addChild(this.world);

    this.particles = [];
    this.exportParticles = [];
  }

  clear() {
    for (const particle of this.particles) {
      particle.view.destroy();
    }

    this.container.removeChildren();
    this.particles = [];
    this.exportParticles = [];
  }

  play(settings) {
    this.clear();

    const spineConfig = window.COIN_EXPLOSION.SPINE;

    for (let i = 0; i < settings.particleCount; i++) {
      const particleSpine = this.SpineClass.from({
        skeleton: spineConfig.json,
        atlas: spineConfig.atlas
      });

      particleSpine.x = 0;
      particleSpine.y = 0;
      particleSpine.scale.set(settings.startScale);
      particleSpine.alpha = settings.startOpacity;

      const angle = Math.random() * Math.PI * 2;

      const velocityMultiplier = this.randomRange(
        1 - settings.velocityRandomness,
        1 + settings.velocityRandomness
      );

      const speed = settings.velocity * velocityMultiplier;

      const lifetime = settings.lifetime * this.randomRange(
        1 - settings.lifetimeRandomness,
        1 + settings.lifetimeRandomness
      );

      const startRotation = this.randomRange(-settings.rotation, settings.rotation);

      const rotationSpeed = this.randomRange(
        -settings.rotationSpeed,
        settings.rotationSpeed
      );

      particleSpine.rotation = this.degToRad(startRotation);
      particleSpine.state.setAnimation(0, spineConfig.animation, true);

      const particleData = {
        id: i,
        x: 0,
        y: 0,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        gravity: settings.gravity,
        age: 0,
        lifetime,
        startScale: settings.startScale,
        endScale: settings.endScale,
        startOpacity: settings.startOpacity,
        endOpacity: settings.endOpacity,
        startRotation,
        rotationSpeed
      };

      const particle = {
        view: particleSpine,
        ...particleData
      };

      this.particles.push(particle);
      this.exportParticles.push({ ...particleData });

      this.container.addChild(particleSpine);
    }
  }

  update(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      p.age += dt;

      const progress = Math.min(p.age / p.lifetime, 1);

      p.vy += p.gravity * dt;

      p.x += p.vx * dt;
      p.y += p.vy * dt;

      p.view.x = p.x;
      p.view.y = p.y;

      const scale = this.lerp(p.startScale, p.endScale, progress);
      p.view.scale.set(scale);

      p.view.alpha = this.lerp(p.startOpacity, p.endOpacity, progress);

      const rotation = p.startRotation + p.rotationSpeed * p.age;
      p.view.rotation = this.degToRad(rotation);

      if (p.age >= p.lifetime) {
        p.view.destroy();
        this.particles.splice(i, 1);
      }
    }
  }

  exportSpineMotion(settings) {
    const fps = 30;
    const duration = settings.lifetime * (1 + settings.lifetimeRandomness);
    const totalFrames = Math.ceil(duration * fps);

    const imageBasePath = "coins/coins_";
    const imageFrameCount = 14;
    const imageStart = 0;
    const imageDigits = 5;
    const imageWidth = 144;
    const imageHeight = 142;
    const imageDelay = 1 / fps;

    const bones = [{ name: "root" }];
    const slots = [];
    const skinAttachments = {};
    const boneAnimations = {};
    const slotColorAnimations = {};
    const sequenceAnimations = {};

    for (const p of this.exportParticles) {
      const id = String(p.id).padStart(3, "0");
      const boneName = `particle_${id}_bone`;
      const slotName = `particle_${id}_slot`;

      bones.push({
        name: boneName,
        parent: "root"
      });

      slots.push({
        name: slotName,
        bone: boneName,
        attachment: imageBasePath,
        color: "ffffffff"
      });

      skinAttachments[slotName] = {
        [imageBasePath]: {
          width: imageWidth,
          height: imageHeight,
          sequence: {
            count: imageFrameCount,
            start: imageStart,
            digits: imageDigits
          }
        }
      };

      boneAnimations[boneName] = {
        translate: [],
        scale: [],
        rotate: []
      };

      slotColorAnimations[slotName] = {
        [imageBasePath]: []
      };

      sequenceAnimations[slotName] = {
        [imageBasePath]: {
          sequence: [
            {
              mode: "loop",
              delay: imageDelay
            }
          ]
        }
      };

      let x = 0;
      let y = 0;
      let vx = p.vx;
      let vy = p.vy;

      for (let frame = 0; frame <= totalFrames; frame++) {
        const time = frame / fps;
        const aliveTime = Math.min(time, p.lifetime);
        const progress = Math.min(aliveTime / p.lifetime, 1);

        if (frame === 0) {
          x = 0;
          y = 0;
          vy = p.vy;
        } else if (time <= p.lifetime) {
          const dt = 1 / fps;
          vy += p.gravity * dt;
          x += vx * dt;
          y += vy * dt;
        }

        const scale = this.lerp(p.startScale, p.endScale, progress);
        const alpha = this.lerp(p.startOpacity, p.endOpacity, progress);
        const rotation = p.startRotation + p.rotationSpeed * aliveTime;

        boneAnimations[boneName].translate.push({
          time,
          x,
          y
        });

        boneAnimations[boneName].scale.push({
          time,
          x: scale,
          y: scale
        });

        boneAnimations[boneName].rotate.push({
          time,
          value: rotation
        });

        slotColorAnimations[slotName][imageBasePath].push({
          time,
          color: this.alphaToSpineColor(alpha)
        });
      }
    }

    return {
      skeleton: {
        hash: "coin-explosion-export",
        spine: settings.spineVersion || "4.3.21",
        x: -72,
        y: -71,
        width: 144,
        height: 142,
        images: "",
        audio: null
      },
      bones,
      slots,
      skins: [
        {
          name: "default",
          attachments: skinAttachments
        }
      ],
      animations: {
        explosion: {
          bones: boneAnimations,
          slots: {
            default: slotColorAnimations
          },
          attachments: {
            default: sequenceAnimations
          }
        }
      }
    };
  }

  alphaToSpineColor(alpha) {
    const a = Math.round(this.clamp01(alpha) * 255)
      .toString(16)
      .padStart(2, "0");

    return `ffffff${a}`;
  }

  lerp(a, b, t) {
    return a + (b - a) * t;
  }

  randomRange(min, max) {
    return min + Math.random() * (max - min);
  }

  clamp01(value) {
    return Math.min(1, Math.max(0, value));
  }

  degToRad(degrees) {
    return degrees * Math.PI / 180;
  }
};