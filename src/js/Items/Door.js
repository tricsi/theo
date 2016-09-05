class Door extends Item {

    constructor(pos, key) {
        super(pos);
        this.key = key || false;
        this.open = key ? false : true;
        this.size = 12;
    }

    render(draw) {
        let pos = new Vec(-12, -21).add(this.pos);
        draw.sprite(this.open ? 24 : 0, 104, 24, 32, pos.x, pos.y);
        if (this.key) {
            let key = new Vec(-12, -21).add(this.key);
            draw.sprite(48, 104, 24, 32, key.x, key.y);
        }
    }

    update(hero) {
        let result = false;
        if (!this.key) {
            result = hero.pos.clone().sub(this.pos).mag() < hero.size;
        } else if (hero.pos.clone().sub(this.key).mag() < hero.size + this.size) {
            Sfx.play("key");
            this.key = false;
        }
        if (result) {
            this.open = true;
        }
        return result;
    }

}