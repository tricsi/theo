class Boss extends Item {

    constructor(pos) {
        super(pos);
        this.size = 32;
        this.speed = new Vec();
        this.velociy = 1;
        this.frame = 0;
        this.sfx = new Sfx([1,0.17,0.19,0.41,0.38,0.14,,0.001,0.001,,0.96,0.77,0.31,,0.077,0.66,0.5,0.64,0.99,0.04,0.38,0.05,0.0006,0.4]);
    }

    start() {
        this.src = this.sfx.play(true);
    }

    stop() {
        this.src.stop();
    }

    update(hero, room) {
        this.speed = hero.pos.clone().sub(this.pos).bit().multiply(this.velociy);
        this.pos.x += this.speed.x;
        room.collide(this.pos, this.size);
        this.pos.y += this.speed.y;
        room.collide(this.pos, this.size);
        let dist = hero.pos.clone().sub(this.pos).mag(),
            gain = 1 - dist / 300;
        this.sfx.mixer.gain.value = gain > .1 ? gain : .1;
        if (dist < this.size + hero.size) {
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