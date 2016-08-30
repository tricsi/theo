const ctx = $("#game").getContext("2d");
const cam = new Camera(300);
const draw = new Draw(ctx);
const game = new Game(draw, [
    "M3,7,7,6,3|H4,6|D5,6|W6,6|#I have to escape!",
    "M4,8,6,3,8,2,2,3,4|H4,7|D7,2|#I can jump on walls!",
    "M0,0,10,10,0|M1,1,9,9,1,3,7,7,3,5,4,6,6,4,2,8,8,2,1|H1,0|D2,0,5,5|#The door is locked.|#I need a key!",
    "M0,10,10,7,1,6,10,3,1,2,10,1,0,4,9,5,0,8,9,9,0|C3,9|C5,9|C7,9|C3,5|C5,5|C7,5|C3,1|C5,1|C7,1|H1,9|D0,9,9,1|#Hmm...|#This cog is dangerous!",
    "M0,10,4,9,2,1,8,2,3,3,8,4,3,7,8,6,4,5,9,10,10,0,0|G5,9|H2,0|D7,6,3,9|C4,0,5,0|E6,6|B0,0|#This wall has no texture!",
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
