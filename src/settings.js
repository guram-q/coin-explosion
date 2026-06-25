window.COIN_EXPLOSION = window.COIN_EXPLOSION || {};

window.COIN_EXPLOSION.VERSION = "v2.1";

window.COIN_EXPLOSION.SPINE = {
  json: "./assets/coin/coin_anim.json",
  atlas: "./assets/coin/coin_anim.atlas",
  animation: "coin_anim"
};

window.COIN_EXPLOSION.DEFAULT_SETTINGS = {
  particleCount: 30,
  velocity: 400,
  velocityRandomness: 0.5,
  gravity: 800,
  lifetime: 2,
  startScale: 0.6,
  endScale: 0.2,
  startOpacity: 1,
  endOpacity: 0,
  rotationSpeed: 180
};