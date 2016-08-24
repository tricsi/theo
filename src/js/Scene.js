class Scene {

    constructor(hero, room, exit, mobs) {
        this.cam = cam;
        this.room = room;
        this.hero = hero;
        this.mobs = mobs || [];
        this.exit = exit;
        this.enter = new Door(hero.pos.clone());
        this.run = false;
        this.img = false;
    }

    render(draw) {
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
        const hero = this.hero;
        const exit = this.exit;
        if(!hero.alive || exit.open) {
            this.run = false;
            hero.stop();
            return;
        }
        hero.update(this.room);
        this.mobs.forEach((mob) => mob.update(hero));
        exit.update(hero);
    }

    tap() {
        const hero = this.hero;
        if (this.run) {
            hero.jump();    
        } else {
            hero.start();
            this.run = true;
        }
    }

}