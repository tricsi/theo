class Scene {

    constructor(hero, room, exit) {
        this.cam = cam;
        this.room = room;
        this.hero = hero;
        this.exit = exit;
        this.enter = new Door(hero.pos.clone());
        this.run = false;
        this.img = false;
    }

    render(draw) {
        if (!this.img) {
            this.room.render(draw);
            this.enter.render(draw);
            this.img = draw.merge();
        } else {
            draw.img(this.img);
        }
        this.exit.render(draw);
        this.hero.render(draw);
    }

    update() {
        this.hero.update(this.room);
        this.exit.update(this.hero);
        if (this.exit.open) {
            this.hero.stop();
        }
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