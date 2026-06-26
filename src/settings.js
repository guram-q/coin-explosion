window.COIN_EXPLOSION = window.COIN_EXPLOSION || {};

window.COIN_EXPLOSION.VERSION = "v2.2";

window.COIN_EXPLOSION.SPINE = {
  json: "./assets/coin/coin_anim.json",
  atlas: "./assets/coin/coin_anim.atlas",
  animation: "coin_anim"
};

window.COIN_EXPLOSION.DEFAULT_SETTINGS = {
    worldScale: 0.4,

    particleCount: 20,

    velocity: 300,
    velocityRandomness: 0.5,
    gravity: 200,

    lifetime: 0.7,

    startScale: 0.5,
    endScale: 0.15,

    startOpacity: 1,
    endOpacity: 0,

    rotation: 360,
    rotationSpeed: 360
};