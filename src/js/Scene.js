class Scene {

    constructor(hero, room, exit) {
        this.cam = cam;
        this.room = room;
        this.hero = hero;
        this.exit = exit;
        this.enter = new Door(hero.pos.clone(), false, true);
        this.run = false;
    }

    render(renderer) {
        this.room.render(renderer);
        this.enter.render(renderer);
        this.exit.render(renderer);
        this.hero.render(renderer);
    }

    anim() {
        this.hero.anim(this.room);
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