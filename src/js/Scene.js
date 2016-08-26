class Scene {

    constructor(hero, room, exit, mobs) {
        this.room = room;
        this.hero = hero;
        this.mobs = mobs || [];
        this.exit = exit;
        this.enter = new Door(hero.pos.clone().add(new Vec(12, 0)));
        this.run = false;
        this.img = false;
    }

    render(draw) {
        draw.clear();
        if (!this.img) {
            this.room.render(draw);
            this.enter.render(draw);
            this.mobs.forEach((mob) => mob.pre(draw));
            this.img = draw.merge();
        } else {
            draw.img(this.img);
        }
        this.exit.render(draw);
        this.hero.render(draw);
        this.mobs.forEach((mob) => mob.render(draw));
    }

    update() {
        let hero = this.hero,
            room = this.room,
            exit = this.exit;
        if (!this.run || !hero.alive || exit.open) {
            return;
        }
        hero.update(room);
        this.mobs.forEach((mob) => mob.update(hero, room));
        exit.update(hero);
    }

    tap() {
        const hero = this.hero;
        if (!this.run) {
            this.run = true;
        } else if (hero.alive) {
            hero.jump();    
        }
    }

}