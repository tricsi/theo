class Scene {

    constructor(hero, room, exit, mobs, text) {
        this.room = room;
        this.hero = hero;
        this.exit = exit;
        this.mobs = mobs || [];
        this.text = text || [];
        this.run = false;
        this.won = false;
        this.img = false;
        this.sfxWon = new Sfx([2,0.005,0.18,0.13,0.44,0.51,,0.35,0.19,0.02,0.81,-0.8,0.89,0.44,,0.49,-0.78,-0.46,0.99,,-0.045,0.012,0.004,0.35]);
        this.sfxLose = new Sfx([1,0.003,0.03,0.02,0.87,0.25,,0.016,-0.16,,0.08,-0.36,0.067,,0.75,0.04,-0.75,0.001,0.73,-0.016,0.89,0.24,-0.19,0.5]);
    }

    render(draw) {
        draw.clear();
        if (!this.img) {
            this.room.pre(draw);
            this.mobs.forEach((mob) => mob.pre(draw));
            this.img = draw.merge();
        } else {
            draw.img(this.img);
        }
        this.exit.render(draw);
        this.hero.render(draw);
        this.mobs.forEach((mob) => mob.render(draw));
        if (!this.run && this.text.length > 0) {
            draw.begin()
                .to(this.hero.pos.clone().add(-16, -22))
                .text(this.text, 0, 4)
                .end();
        }
    }

    start() {
        this.run = true;
        this.hero.start();
        this.exit.start();
        this.mobs.forEach((mob) => mob.start());
    }

    stop() {
        this.hero.stop();
        this.exit.stop();
        this.mobs.forEach((mob) => mob.stop());
    }

    update() {
        let hero = this.hero,
            room = this.room,
            exit = this.exit;
        if (!this.run || !hero.alive || this.won) {
            return;
        }
        hero.update(room);
        this.mobs.forEach((mob) => mob.update(hero, room));
        if (!hero.alive) {
            this.sfxLose.play();
            this.stop();
        } else if (exit.update(hero)) {
            this.won = true;
            this.sfxWon.play();
            this.stop();
        }
    }

}