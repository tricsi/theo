class Scene {

    constructor(hero, room, exit, mobs, text) {
        this.room = room;
        this.hero = hero;
        this.exit = exit;
        this.mobs = mobs || [];
        this.text = text || [];
        this.run = 0;
        this.won = false;
        this.img = false;
    }

    render(draw) {
        draw.clear();
        if (!this.img) {
            this.room.pre(draw);
            this.exit.pre(draw);
            this.mobs.forEach((mob) => mob.pre(draw));
            this.img = draw.merge();
        } else {
            draw.img(this.img);
        }
        this.exit.render(draw);
        this.mobs.forEach((mob) => mob.render(draw));
        this.hero.render(draw);
        if (!this.run && this.text.length > 0) {
            draw.begin()
                .to(this.hero.pos.clone().add(-16, -22))
                .text(this.text, 0, 5, 1)
                .end();
        }
    }

    start() {
        this.run = new Date().getTime();
        this.hero.start();
        this.exit.start();
        this.mobs.forEach((mob) => mob.start());
    }

    stop() {
        this.run = new Date().getTime() - this.run;
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
            Sfx.play("lose");
            this.stop();
        } else if (exit.update(hero)) {
            this.won = true;
            Sfx.play("won");
            this.stop();
        }
    }

}