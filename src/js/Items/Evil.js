class Evil {

    constructor(pos) {
        this.pos = pos;
        this.size = 12;
        this.speed = new Vec();
        this.velociy = .5;
        this.collide = new Vec();
    }

    pre(draw) {}

    update(hero, room) {
        this.speed = hero.pos.clone().sub(this.pos).norm().multiply(this.velociy);
        this.pos.add(this.speed);
        this.collide = room.collide(this.pos, this.size);
        if (hero.pos.clone().sub(this.pos).mag() < this.size + hero.size) {
            hero.alive = false;
        }
    }

    render(draw) {
        let pos = this.pos.clone().sub(12),
            vec = this.speed.clone().bit();
        if (this.collide.x) {
            vec.y = 0;
        }
        if (this.collide.y) {
            vec.x = 0;
        }
        vec.multiply(24);
        draw.sprite(vec.x + 120, vec.y + 24, 24, 24, pos.x, pos.y);
    }

}