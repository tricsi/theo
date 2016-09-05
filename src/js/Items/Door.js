class Door extends Item {

    constructor(pos, key) {
        super(pos);
        this.key = key || false;
        this.open = key ? false : true;
        this.size = 12;
        this.sfxKey = new Sfx([0,,0.0354,,0.4903,0.4187,,0.3668,,,,,,0.5161,,0.4372,,,1,,,,,0.5]);
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
            this.sfxKey.play();
            this.key = false;
        }
        if (result) {
            this.open = true;
        }
        return result;
    }

}