(async () => {
  const canvasContainer = document.getElementById("canvasContainer");



  const app = new PIXI.Application();

  await app.init({
    background: "#050505",
    resizeTo: canvasContainer,
    antialias: true
  });

  canvasContainer.appendChild(app.canvas);

  const SpineClass = window.spinePixi?.Spine || window.spine?.Spine;

  if (!SpineClass) {
    alert("Spine runtime not found.");
    return;
  }

  const spineConfig = window.COIN_EXPLOSION.SPINE;

  await PIXI.Assets.load([
    spineConfig.json,
    spineConfig.atlas
  ]);

  const particleSystem = new window.COIN_EXPLOSION.ParticleSystem(
    app,
    SpineClass
  );

  function play() {
    const settings = window.COIN_EXPLOSION.UI.getSettings();
    particleSystem.play(settings);
  }

  document.getElementById("playButton").addEventListener("click", play);

  document.getElementById("exportButton").addEventListener("click", () => {
    const settings = window.COIN_EXPLOSION.UI.getSettings();

    const spineJson = particleSystem.exportSpineMotion(settings);
    const json = JSON.stringify(spineJson, null, 2);

    const blob = new Blob([json], {
      type: "application/json"
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "coin_explosion_spine_motion.json";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  });;

  app.ticker.add((ticker) => {
    const dt = ticker.deltaMS / 1000;
    const settings = window.COIN_EXPLOSION.UI.getSettings();

    particleSystem.world.position.set(
      app.screen.width / 2,
      app.screen.height / 2
    );

    particleSystem.container.scale.set(settings.worldScale || 1);

    particleSystem.update(dt);
  });

  play();

  console.log("Coin Explosion initialized", window.COIN_EXPLOSION.VERSION);
})();