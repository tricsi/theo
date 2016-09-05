class Hero extends Item {

    constructor(pos, bound) {
        super(pos);
        this.size = 12;
        this.bound = bound;
        this.alive = true;
        this.speed = new Vec(.1);
        this.minSpeed = new Vec();
        this.maxSpeed = new Vec(3, 5);
        this.velocity = new Vec(.1, .15);
        this.jumpSpeed = new Vec(3, -5);
        this.sfxJump = new Sfx([0,,0.123,,0.2154,0.301,,0.2397,,,,,,0.4311,,,,,1,,,0.1789,,0.46]);
        this.sfxSlide = new Sfx([3,0.52,1,,1,1,1,0.6599,,,,-1,,,,,,,0.44,,,0.66,0.5,0.3]);
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
        let pos = this.pos,
            size = this.size,
            speed = this.speed,
            bound = this.bound,
            collide = new Vec();
        this.speed.add(this.velocity).max(this.maxSpeed),
        pos.x += speed.x;
        collide.y = room.collide(pos, size, true);
        pos.y += speed.y;
        collide.x = room.collide(pos, size, true);
        if (!this.srcSlide && speed.y > 0 && collide.x != collide.y) {
            this.srcSlide = this.sfxSlide.play(true);
        } else if (collide.x == collide.y) {
            this.stop();
        }
        if (collide.x || (collide.y && !this.collide.y)) {
            speed.y = this.minSpeed.y;
        } 
        this.collide = collide;
        if (
            pos.x < -size ||
            pos.y < -size || 
            pos.x > bound.x + size ||
            pos.y > bound.y + size
        ) {
            this.alive = false;
        }
    }

    stop() {
        if (this.srcSlide) {
            this.srcSlide.stop();
            this.srcSlide = false;
        }
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
            this.sfxJump.play();
            if (this.srcSlide) {
                this.srcSlide.stop();
            }
        }
    }

}
