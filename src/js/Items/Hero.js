class Hero extends Item {

    constructor(pos) {
        super(pos);
        this.size = 12;
        this.alive = true;
        this.speed = new Vec();
        this.minSpeed = new Vec();
        this.maxSpeed = new Vec(3, 5);
        this.velocity = new Vec(.1, .15);
        this.jumpSpeed = new Vec(3, -5);
        this.jumpSfx = new Sfx([0,,0.123,,0.2154,0.301,,0.2397,,,,,,0.4311,,,,,1,,,0.1789,,0.46]);
        this.collide = new Vec();
    }

    render(draw) {
        let pos = this.pos.clone().sub(12),
            vec = new Vec(72, 0);
        if (this.alive) {
            vec = this.speed.clone().bit();
            if (this.collide.x) {
                vec.y = 0;
            }
            if (this.collide.y) {
                vec.x = 0;
            }
            vec.multiply(24).add(24);
        }
        draw.sprite(vec.x, vec.y, 24, 24, pos.x, pos.y);
    }

    update(room) {
        this.speed.add(this.velocity).max(this.maxSpeed),
        this.pos.add(this.speed);
        let collide = room.collide(this.pos, this.size);
        if (collide.x || (collide.y && !this.collide.y)) {
            this.speed.y = this.minSpeed.y;
        }
        this.collide = collide;
    }

    turn() {
        this.velocity.x = -this.velocity.x;
        this.speed.x = this.velocity.x < 0 ? -this.jumpSpeed.x : this.jumpSpeed.x;

    }

    jump() {
        const collide = this.collide;
        if (collide.x || collide.y) {
            this.speed.y = this.jumpSpeed.y;
            if (collide.y && !collide.x) {
                this.turn();
            }
            this.jumpSfx.play();
        }
    }

}
