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
});