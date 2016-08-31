let ctx = $("#game").getContext("2d"),
    cam = new Camera($("#cam").getContext("2d"), 300, "#420"),
    draw = new Draw(ctx),
    game = new Game(draw, [
        "M3,7,7,6,3|H4,6|D5,6|W6,6|#I have to escape!", //Prologue
        "M4,8,6,3,8,2,2,3,4|H4,7|D7,2|#I can jump on walls!", //Jump traning
        "M0,0,10,10,0|M1,1,9,9,1,3,7,7,3,5,4,6,6,4,2,8,8,2,1|H1,0|D2,0,5,5|#The door is locked.|#I need a key!", //Lost key
        "M0,10,10,7,1,6,10,3,1,2,10,1,0,4,9,5,0,8,9,9,0|C3,9|C5,9|C7,9|C3,5|C5,5|C7,5|C3,1|C5,1|C7,1|H1,9|D0,9,9,1|#Hmm...|#This cog is dangerous!", //Cogs
        "M0,2,1,1,2,2,3,1,4,2,5,1,6,2,7,1,8,2,9,1,10,9,9,8,8,10,7,8,6,10,5,8,4,10,3,8,2,10,1,8,0,7,1,6,2,7,3,6,4,7,5,6,6,7,7,6,8,7,9,3,8,5,7,3,6,5,5,3,4,5,3,3,2,5,1,3,0|H9,8|D0,2,0,7|C1,4|C3,4|C5,4|C7,4|C1,9|C3,9|C5,9|C7,9|#More cogs?|#Great!", //More cogs
        "M0,10,10,0,0|M2,9,6,2,8,1,4,8,2|G7,11|H0,9|D7,0,3,7|C0,6,3,6|C9,6,6,6|#This wall has no texture?", //Glitch
        "M0,10,10,0,0|M1,1,3,3,4,1,6,3,7,1,9,5,8,9,7,4,3,9,2,5,1|M4,6,6,8,4|H1,0|D4,0,5,5|E1,5|E8,5|#Strange noises...", //Tower
        "M0,10,4,9,2,1,8,2,3,3,8,4,3,7,8,6,4,5,9,10,10,0,0|G5,9|H2,0|D7,6,3,9|C4,0,5,0|E5,6|B0,0|W6,6|#A monstrous creature!" //Boss
    ]);

function update() {
    game.update(); 
    game.render();
    cam.pos = game.scene.hero.pos;
    cam.render(ctx);
    requestAnimationFrame(update);
}

on(document, "mousedown,touchstart", (e) => {
    e.preventDefault();
    let x = document.documentElement.clientWidth - (e.clientX || e.touches[0].clientX),
        y = e.clientY || e.touches[0].clientY;
    if (x < 48 && y < 48) {
        fullscreen();
    } else {
        game.tap();
    }
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
