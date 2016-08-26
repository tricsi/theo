const ctx = $("#game").getContext("2d");
const cam = new Camera(300);
const draw = new Draw(ctx);
const sprite = new Sprite(draw);
const scene = new Scene(
    new Hero(new Vec(250, 101)),
    new Room([0, 10, 2, 9, 1, 1, 9, 2, 2, 3, 9, 4, 2, 7, 8, 6, 3, 5, 9, 10, 10, 0, 0], 72, 40),
    new Door(new Vec(580, 533), new Vec(160, 750)),
    [
        new Cog(new Vec(450, 96), new Vec(350, 96)),
        new Evil(new Vec(500, 520))
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
