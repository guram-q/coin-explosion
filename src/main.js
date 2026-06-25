import { Application, Assets } from "https://cdn.jsdelivr.net/npm/pixi.js@8.9.2/+esm";
import { Spine } from "https://cdn.jsdelivr.net/npm/@esotericsoftware/spine-pixi-v8@4.3.9/+esm";
import { SPINE } from "./settings.js";

const canvasContainer = document.getElementById("canvasContainer");

const app = new Application();

await app.init({
    background: "#050505",
    resizeTo: canvasContainer,
    antialias: true
});

canvasContainer.appendChild(app.canvas);

console.log("PixiJS initialized");
console.log("Loading:", SPINE);

Assets.add({
    alias: "coinData",
    src: SPINE.json,
    data: {
        spineAtlasFile: SPINE.atlas
    }
});

await Assets.load("coinData");

console.log("Spine data loaded");

const coin = Spine.from({
    skeleton: "coinData"
});

coin.x = app.screen.width / 2;
coin.y = app.screen.height / 2;
coin.scale.set(1);

coin.state.setAnimation(0, SPINE.animation, true);

app.stage.addChild(coin);

window.addEventListener("resize", () => {
    coin.x = app.screen.width / 2;
    coin.y = app.screen.height / 2;
});

document.getElementById("playButton").addEventListener("click", () => {
    coin.state.setAnimation(0, SPINE.animation, true);
});