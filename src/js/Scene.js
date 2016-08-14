class Scene {

    constructor(hero, room, exit) {
        this.cam = cam;
        this.room = room;
        this.hero = hero;
        this.exit = exit;
        this.enter = new Door(hero.pos.clone(), false, true);
        this.run = false;
    }

    render(draw) {
        this.room.render(draw);
        this.enter.render(draw);
        this.exit.render(draw);
        this.hero.render(draw);
    }

    update() {
        this.hero.update(this.room);
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