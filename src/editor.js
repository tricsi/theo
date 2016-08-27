const ctx = $("#game").getContext("2d");
const form = $("#form");
const code = $("#code");
const draw = new Draw(ctx);
const game = new Game(draw, []);

function load() {
    let config = code.value.trim().replace(/\s+/gm, "|");
    $("#config").value = config;
    game.cfg[0] = config;
    game.load(0);
}

function update() {
    requestAnimationFrame(update);
    game.update();
}

on(ctx.canvas, "mousedown", (e) => {
    e.preventDefault();
    game.tap();
});

on(form, "submit", (e) => {
    e.preventDefault();
    load();
});

new Sprite(draw).render(() => {
    load();
    update();
});
