window.COIN_EXPLOSION = window.COIN_EXPLOSION || {};

window.COIN_EXPLOSION.exportSettings = function(settings) {
  return JSON.stringify({
    version: window.COIN_EXPLOSION.VERSION,
    spine: window.COIN_EXPLOSION.SPINE,
    settings: settings
  }, null, 2);
};