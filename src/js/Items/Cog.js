class Cog extends Item {

    constructor(pos1, pos2) {
        super(pos1.clone());
        this.line = pos2 ? new Line(pos1, pos2) : null;
        this.size = 16;
        this.speed = 1;
        this.frame = 0;
    }

    pre(draw) {
        let line = this.line;
        if (line) {
            draw.begin()
                .to(line.begin)
                .line(line.end.clone().sub(line.begin))
                .stroke(0, 6)
                .end();
        }
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
        let pos = this.pos,
            line = this.line,
            speed = this.speed;
        if (line) {
            pos.add(line.vec.clone().multiply(speed));
            let dist = pos.clone().sub(line.end).mag();
            if (dist <= speed) {
                pos = line.end.clone();
                this.line = new Line(line.end, line.begin);
            }
        }
        if (hero.pos.clone().sub(pos).mag() < this.size + hero.size) {
            hero.alive = false;
        }
        this.frame += .5;
    }

}