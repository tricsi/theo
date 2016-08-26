const ctx = $("#game").getContext("2d");
const form = $("#form");
const code = $("#code");
const draw = new Draw(ctx);
const sprite = new Sprite(draw);
const game = new Game([]);
let scene;

function load() {
    let config = code.value.trim().replace(/\s+/gm, "|");
    $("#config").value = config;
    game.cfg[0] = config;
    scene = game.load(0);
}

function update() {
    requestAnimationFrame(update);
    scene.update();
    scene.render(draw);
}

on(ctx.canvas, "mousedown", (e) => {
    e.preventDefault();
    scene.tap();
});

on(form, "submit", (e) => {
    e.preventDefault();
    load();
});

sprite.render(() => {
    load();
    update();
});
