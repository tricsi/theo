const ctx = $("#game").getContext("2d");
const cam = new Camera(300);
const draw = new Draw(ctx);
const game = new Game(draw, [
    "M3,7,7,6,3|H4,6|D5,6|W6,6|#I have to escape!",
    "M4,8,6,3,8,2,2,3,4|H4,7|D7,2|#I can jump on walls!",
    "M0,10,4,9,2,1,8,2,3,3,8,4,3,7,8,6,4,5,9,10,10,0,0|G6,8|H2,0|D7,6,3,9|C4,0,5,0|E6,6|#I have to escape!",
]);

function update() {
    requestAnimationFrame(update);
    game.update();
    cam.pos = game.scene.hero.pos;
    cam.render(ctx);
}

on(document, "touchstart", (e) => {
    e.preventDefault();
    game.tap();
});

on(document, "mousedown", (e) => {
    e.preventDefault();
    game.tap();
});

on(document, "keydown", (e) => {
    if (e.keyCode == 32) {
        e.preventDefault();
        game.tap();
    }
});

on(window, "resize", () => {
    cam.resize();
});

new Sprite(draw).render(() => {
    game.load(0);
    update();
});
