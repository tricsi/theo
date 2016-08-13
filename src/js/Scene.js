class Scene {

    constructor(hero, room) {
        this.cam = cam;
        this.room = room;
        this.hero = hero;
        this.run = false;
        this.enter = new Vec(-12, -21).add(hero.pos);
    }

    render(renderer) {
        this.room.render(renderer);
        renderer
            .begin()
            .to(this.enter)
            .img(24, 96, 24, 32)
            .end();
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