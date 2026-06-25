window.COIN_EXPLOSION = window.COIN_EXPLOSION || {};

window.COIN_EXPLOSION.VERSION = "v2.2";

window.COIN_EXPLOSION.SPINE = {
  json: "./assets/coin/coin_anim.json",
  atlas: "./assets/coin/coin_anim.atlas",
  animation: "coin_anim"
};

window.COIN_EXPLOSION.DEFAULT_SETTINGS = {
  particleCount: 40,
  velocity: 500,
  velocityRandomness: 0.5,
  gravity: 700,
  lifetime: 2,
  startScale: 0.5,
  endScale: 0.15,
  startOpacity: 1,
  endOpacity: 0,
  rotation: 360,
  rotationSpeed: 360
};