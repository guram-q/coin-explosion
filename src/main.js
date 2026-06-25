import { Application, Graphics } from "https://cdn.jsdelivr.net/npm/pixi.js@8.9.2/+esm";

const canvasContainer = document.getElementById("canvasContainer");

// Create Pixi application
const app = new Application();

await app.init({
    background: "#151515",
    resizeTo: canvasContainer,
    antialias: true
});

// Add canvas to the page
canvasContainer.appendChild(app.canvas);

console.log("PixiJS initialized");

// Create center marker
const centerMarker = new Graphics();

centerMarker.circle(0, 0, 5);
centerMarker.fill(0xffaa00);

centerMarker.x = app.screen.width / 2;
centerMarker.y = app.screen.height / 2;

app.stage.addChild(centerMarker);

// Keep marker centered after resize
function updateCenterMarker() {
    centerMarker.x = app.screen.width / 2;
    centerMarker.y = app.screen.height / 2;
}

window.addEventListener("resize", updateCenterMarker);

// Play button
document.getElementById("playButton").addEventListener("click", () => {
    console.log("Play clicked");
});

// Export button
document.getElementById("exportButton").addEventListener("click", () => {
    console.log("Export clicked");
});