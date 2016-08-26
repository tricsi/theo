const ctx = $("#game").getContext("2d");
const cam = new Camera(300);
const draw = new Draw(ctx);
const sprite = new Sprite(draw);
const game = new Game([
    "R0,10,2,9,1,1,9,2,2,3,9,4,2,7,8,6,3,5,9,10,10,0,0|H250,100|D580,533,160,750|C450,96,350,96|E500,520"
]);
const scene = game.load(0);

function update() {
    requestAnimationFrame(update);
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
