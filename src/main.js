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

Assets.add({ alias: "coinSkeleton", src: SPINE.json });
Assets.add({ alias: "coinAtlas", src: SPINE.atlas });

await Assets.load(["coinSkeleton", "coinAtlas"]);

console.log("Assets loaded");

const coin = Spine.from({
    skeleton: "coinSkeleton",
    atlas: "coinAtlas"
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

document.getElementById("exportButton").addEventListener("click", () => {
    const data = {
        spine: SPINE,
        particleCount: Number(document.getElementById("particleCount").value),
        velocity: Number(document.getElementById("velocity").value),
        gravity: Number(document.getElementById("gravity").value)
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json"
    });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "coin_explosion_settings.json";
    a.click();
});