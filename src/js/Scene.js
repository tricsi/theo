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

    update() {
        let hero = this.hero,
            room = this.room,
            exit = this.exit;
        if (!this.run || !hero.alive || this.won) {
            return;
        }
        hero.update(room);
        this.mobs.forEach((mob) => mob.update(hero, room));
        this.won = exit.update(hero);
    }

}