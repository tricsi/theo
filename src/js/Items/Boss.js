class Boss extends Item {

    constructor(pos) {
        super(pos);
        this.size = 32;
        this.speed = new Vec();
        this.velociy = 1;
        this.frame = 0;
    }

    update(hero, room) {
        this.speed = hero.pos.clone().sub(this.pos).bit().multiply(this.velociy);
        this.pos.x += this.speed.x;
        room.collide(this.pos, this.size);
        this.pos.y += this.speed.y;
        room.collide(this.pos, this.size);
        if (hero.pos.clone().sub(this.pos).mag() < this.size + hero.size) {
            hero.alive = false;
        }
        this.frame += .5;
    }

    render(draw) {
        const pos = this.pos.clone().sub(36);
        const frame = Math.round(this.frame) % 6;
        draw.sprite(frame * 72, 136, 72, 72, pos.x, pos.y);
    }

}