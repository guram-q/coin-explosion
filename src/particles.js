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

      const speed =
        settings.velocity *
        this.randomRange(
          1 - settings.velocityRandomness,
          1 + settings.velocityRandomness
        );

      const lifetime =
        settings.lifetime *
        this.randomRange(
          1 - settings.lifetimeRandomness,
          1 + settings.lifetimeRandomness
        );

      const startRotation = this.randomRange(
        -settings.rotation,
        settings.rotation
      );

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

      this.particles.push({
        view: particleSpine,
        ...particleData
      });

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

    const spineVersion = settings.spineVersion || "4.3.21";

    const imageAttachment = "coins/coins_";
    const imageFrameCount = 14;
    const imageStart = 0;
    const imageDigits = 5;
    const imageWidth = 144;
    const imageHeight = 142;

    const bones = [{ name: "root" }];
    const slots = [];
    const skinAttachments = {};

    const boneAnimations = {};
    const slotAnimations = {};
    const attachmentAnimations = {
      default: {}
    };

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
        attachment: imageAttachment,
        color: "ffffffff"
      });

      skinAttachments[slotName] = {
        [imageAttachment]: {
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

      slotAnimations[slotName] = {
        alpha: []
      };

      attachmentAnimations.default[slotName] = {
        [imageAttachment]: {
          sequence: [
            {
              time: 0,
              mode: "loop",
              delay: 1 / fps
            }
          ]
        }
      };

      let x = 0;
      let y = 0;
      let vy = p.vy;

      for (let frame = 0; frame <= totalFrames; frame++) {
        const time = Number((frame / fps).toFixed(4));
        const aliveTime = Math.min(time, p.lifetime);
        const progress = Math.min(aliveTime / p.lifetime, 1);

        if (frame === 0) {
          x = 0;
          y = 0;
          vy = p.vy;
        } else if (time <= p.lifetime) {
          const dt = 1 / fps;
          vy += p.gravity * dt;
          x += p.vx * dt;
          y += vy * dt;
        }

        const scale = this.lerp(p.startScale, p.endScale, progress);
        const alpha = this.lerp(p.startOpacity, p.endOpacity, progress);
        const rotation = p.startRotation + p.rotationSpeed * aliveTime;

        boneAnimations[boneName].translate.push({
          time,
          x: Number(x.toFixed(4)),
          y: Number(y.toFixed(4))
        });

        boneAnimations[boneName].scale.push({
          time,
          x: Number(scale.toFixed(4)),
          y: Number(scale.toFixed(4))
        });

        boneAnimations[boneName].rotate.push({
          time,
          value: Number(rotation.toFixed(4))
        });

        slotAnimations[slotName].alpha.push({
          value: Number(p.startOpacity.toFixed(4))
        });

        slotAnimations[slotName].alpha.push({
          time: Number(p.lifetime.toFixed(4)),
          value: Number(p.endOpacity.toFixed(4))
        });
      }
    }

    return {
      skeleton: {
        hash: "coin-explosion-export",
        spine: spineVersion,
        x: -72,
        y: -71,
        width: imageWidth,
        height: imageHeight,
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
          slots: slotAnimations,
          attachments: attachmentAnimations
        }
      }
    };
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