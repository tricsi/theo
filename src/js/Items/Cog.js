class Cog {

    constructor(pos) {
        this.pos = pos;
        this.size = 16;
        this.frame = 0;
    }

    render(draw) {
        const pos = this.pos.clone().sub(this.size);
        const frame = Math.round(this.frame) % 3;
        draw.sprite(frame * 32, 72, 32, 32, pos.x, pos.y);
    }

    /**
     * @param {Hero} hero
     */
    update(hero) {
        if (hero.pos.clone().sub(this.pos).mag() < this.size + hero.size) {
            hero.alive = false;
        }
        this.frame += .5;
    }

}