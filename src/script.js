const ctx = $("#game").getContext("2d");
const cam = new Camera(300);
const draw = new Draw(ctx);
const sprite = new Sprite(draw);
const scene = new Scene(
    new Hero(new Vec(250, 85)),
    new Room([1, 32, 25, 29, 2, 4, 29, 7, 7, 10, 29, 13, 7, 22, 26, 19, 10, 16, 29, 32, 32, 1, 1], 24),
    new Door(new Vec(550, 85), new Vec(400, 85))
);

function update() {
    window.requestAnimationFrame(update);
    scene.update();
    scene.render(draw);
    cam.pos = scene.hero.pos;
    cam.render(ctx);
}

on(document, "touchstart", function (e) {
    e.preventDefault();
    scene.tap();
});

on(document, "mousedown", function (e) {
    e.preventDefault();
    scene.tap();
});

on(document, "keydown", function (e) {
    if (e.keyCode == 32) {
        scene.tap();
    }
});

on(window, "resize", function () {
    cam.resize();
});

sprite.render();
update();
