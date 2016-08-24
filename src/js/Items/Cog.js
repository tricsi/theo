class Cog {

    constructor(pos) {
        this.pos = pos;
        this.size = 12;
        this.frame = 0;
    }

    render(draw) {
        const pos = this.pos.clone().sub(this.size);
        const frame = Math.round(this.frame) % 3;
        draw.sprite(frame * 24, 72, 24, 24, pos.x, pos.y);
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