import { Application } from "https://cdn.jsdelivr.net/npm/pixi.js@8.9.2/+esm";

const canvasContainer = document.getElementById("canvasContainer");

// Create Pixi application
const app = new Application();

await app.init({
    background: "#151515",
    resizeTo: canvasContainer,
    antialias: true
});

// Add canvas to page
canvasContainer.appendChild(app.canvas);

console.log("PixiJS initialized");

// Draw center marker
const graphics = new PIXI.Graphics();

graphics.circle(0, 0, 5);
graphics.fill(0xffaa00);

graphics.x = app.screen.width / 2;
graphics.y = app.screen.height / 2;

app.stage.addChild(graphics);

// Keep marker centered when browser resizes
window.addEventListener("resize", () => {
    graphics.x = app.screen.width / 2;
    graphics.y = app.screen.height / 2;
});

// Buttons
document.getElementById("playButton").addEventListener("click", () => {
    console.log("Play clicked");
});

document.getElementById("exportButton").addEventListener("click", () => {
    console.log("Export clicked");
});