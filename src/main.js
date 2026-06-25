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

    const SPINE_JSON = "./assets/coin/coin_anim.json";
    const SPINE_ATLAS = "./assets/coin/coin_anim.atlas";
    const ANIMATION_NAME = "coin_anim";

    await PIXI.Assets.load([SPINE_JSON, SPINE_ATLAS]);

    let particles = [];

    function spawnParticles() {
        for (const p of particles) {
            app.stage.removeChild(p.view);
            p.view.destroy();
        }

        particles = [];

        const count = Number(document.getElementById("particleCount").value);
        const velocity = Number(document.getElementById("velocity").value);
        const gravity = Number(document.getElementById("gravity").value);

        for (let i = 0; i < count; i++) {
            const coin = SpineClass.from({
                skeleton: SPINE_JSON,
                atlas: SPINE_ATLAS
            });

            coin.x = app.screen.width / 2;
            coin.y = app.screen.height / 2;
            coin.scale.set(0.6);
            coin.state.setAnimation(0, ANIMATION_NAME, true);

            const angle = Math.random() * Math.PI * 2;
            const speed = velocity * (0.5 + Math.random());

            particles.push({
                view: coin,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                gravity
            });

            app.stage.addChild(coin);
        }
    }

    app.ticker.add((ticker) => {
        const dt = ticker.deltaMS / 1000;

        for (const p of particles) {
            p.vy += p.gravity * dt;
            p.view.x += p.vx * dt;
            p.view.y += p.vy * dt;
        }
    });

    document.getElementById("playButton").addEventListener("click", spawnParticles);

    spawnParticles();
})();