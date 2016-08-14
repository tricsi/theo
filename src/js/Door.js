class Door {

    constructor(pos, key, open) {
        this.pos = pos;
        this.key = key || false;
        this.open = open || false;
    }

    render(draw) {
        let pos = new Vec(-12, -21).add(this.pos);
        draw.sprite(this.open ? 24 : 0, 96, 24, 32, pos.x, pos.y);
        if (this.key) {
            let key = new Vec(-12, -21).add(this.key);
            draw.sprite(48, 96, 24, 32, key.x, key.y);
        }
    }

}