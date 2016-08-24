const ctx = $("#game").getContext("2d");
const cam = new Camera(300);
const draw = new Draw(ctx);
const sprite = new Sprite(draw);
const scene = new Scene(
    new Hero(new Vec(250, 85)),
    new Room([1, 32, 5, 29, 2, 4, 29, 7, 7, 10, 29, 13, 7, 22, 26, 19, 10, 16, 29, 32, 32, 1, 1], 24),
    new Door(new Vec(580, 517), new Vec(100, 757)),
    [
        new Cog(new Vec(400, 80))
    ]
);

function update() {
    window.requestAnimationFrame(update);
    scene.update();
    scene.render(draw);
    cam.pos = scene.hero.pos;
    cam.render(ctx);
}

on(document, "touchstart", (e) => {
    e.preventDefault();
    scene.tap();
});

on(document, "mousedown", (e) => {
    e.preventDefault();
    scene.tap();
});

on(document, "keydown", (e) => {
    if (e.keyCode == 32) {
        e.preventDefault();
        scene.tap();
    }
});

on(window, "resize", () => {
    cam.resize();
});

sprite.render(() => {
    update();
});
