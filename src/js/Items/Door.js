class Door {

    constructor(pos, key) {
        this.pos = pos;
        this.key = key || false;
        this.open = key ? false : true;
        this.size = 10;
    }

    render(draw) {
        let pos = new Vec(-12, -21).add(this.pos);
        draw.sprite(this.open ? 24 : 0, 96, 24, 32, pos.x, pos.y);
        if (this.key) {
            let key = new Vec(-12, -21).add(this.key);
            draw.sprite(48, 96, 24, 32, key.x, key.y);
        }
    }

    update(hero) {
        if (!this.key) {
            this.open = hero.pos.clone().sub(this.pos).mag() < this.size;
        } else if (hero.pos.clone().sub(this.key).mag() < this.size) {
            this.key = false;
        }
    }

}