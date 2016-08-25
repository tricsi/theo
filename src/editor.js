const ctx = $("#game").getContext("2d");
const code = $("#code");
const draw = new Draw(ctx);
const sprite = new Sprite(draw);
const scene = eval(code.value);

function update() {
    window.requestAnimationFrame(update);
    scene.update();
    scene.render(draw);
}

on(ctx.canvas, "mousedown", (e) => {
    e.preventDefault();
    scene.tap();
});

sprite.render(() => {
    update();
});
