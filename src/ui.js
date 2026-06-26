window.COIN_EXPLOSION = window.COIN_EXPLOSION || {};

window.COIN_EXPLOSION.UI = {
  getSettings() {
    return {
      worldScale: Number(document.getElementById("worldScale").value),
      particleCount: Number(document.getElementById("particleCount").value),
      velocity: Number(document.getElementById("velocity").value),
      velocityRandomness: Number(document.getElementById("velocityRandomness").value),
      gravity: Number(document.getElementById("gravity").value),
      lifetime: Number(document.getElementById("lifetime").value),
      lifetimeRandomness: Number(document.getElementById("lifetimeRandomness").value),
      startScale: Number(document.getElementById("startScale").value),
      endScale: Number(document.getElementById("endScale").value),
      startOpacity: Number(document.getElementById("startOpacity").value),
      endOpacity: Number(document.getElementById("endOpacity").value),
      rotation: Number(document.getElementById("rotation").value),
      rotationSpeed: Number(document.getElementById("rotationSpeed").value)
    };
  },

  setExportText(text) {
    document.getElementById("exportOutput").value = text;
  }
};