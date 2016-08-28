const ctx = $("#game").getContext("2d");
const cam = new Camera(300);
const draw = new Draw(ctx);
const game = new Game(draw, [
    "R3,7,7,6,3|H5,7|D6,7|W7,7|#I have to escape!",
    "R0,10,4,9,2,1,8,2,3,3,8,4,3,7,8,6,4,5,9,10,10,0,0|H3,1|D8,7,3,10|C5,1,6,1|E7,7|#This cog is dangerous!"
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
