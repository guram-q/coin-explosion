(async () => {
    const canvasContainer = document.getElementById("canvasContainer");

    const app = new PIXI.Application();

    await app.init({
        background: "#050505",
        resizeTo: canvasContainer,
        antialias: true
    });

    canvasContainer.appendChild(app.canvas);

    console.log("PixiJS initialized");
    console.log("window.spinePixi:", window.spinePixi);
    console.log("window.spine:", window.spine);

    const SpineClass = window.spinePixi?.Spine || window.spine?.Spine;

    if (!SpineClass) {
        throw new Error("Spine class not found. Runtime script did not load correctly.");
    }

    const SPINE_JSON = "./assets/coin/coin_anim.json";
    const SPINE_ATLAS = "./assets/coin/coin_anim.atlas";
    const ANIMATION_NAME = "coin_anim";

    await PIXI.Assets.load([
        SPINE_JSON,
        SPINE_ATLAS
    ]);

    const coin = SpineClass.from({
        skeleton: SPINE_JSON,
        atlas: SPINE_ATLAS
    });

    coin.x = app.screen.width / 2;
    coin.y = app.screen.height / 2;
    coin.scale.set(1);

    app.stage.addChild(coin);

    console.log(
        "Animations:",
        coin.skeleton.data.animations.map(a => a.name)
    );

    coin.state.setAnimation(0, ANIMATION_NAME, true);

    window.addEventListener("resize", () => {
        coin.x = app.screen.width / 2;
        coin.y = app.screen.height / 2;
    });

    document.getElementById("playButton").addEventListener("click", () => {
        coin.state.setAnimation(0, ANIMATION_NAME, true);
    });
})();