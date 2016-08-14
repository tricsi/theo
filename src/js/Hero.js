class Hero {

    constructor(pos) {
        this.pos = pos;
        this.size = 12;
        this.minSpeed = new Vec();
        this.maxSpeed = new Vec(3, 5);
        this.jumpSpeed = new Vec(3, -5);
        this.collide = new Vec();
        this.stop();
    }

    stop() {
        this.speed = new Vec();
        this.velocity = new Vec();
    }

    start() {
        this.velocity = new Vec(.1, .15);
    }

    render(renderer) {
        const pos = this.pos.clone().sub(12);
        const vec = this.speed.clone().bit();
        if (this.collide.x) {
            vec.y = 0;
        }
        if (this.collide.y) {
            vec.x = 0;
        }
        vec.multiply(24).add(24);
        renderer.sprite(vec.x, vec.y, 24, 24, pos.x, pos.y);
    }

    anim(room) {
        const collide = new Vec();
        const size = this.size;
        const speed = this.speed
            .add(this.velocity)
            .max(this.maxSpeed)
            .clone();
        const pos = this.pos.add(speed);
        room.lines.forEach(function (line) {
            const dot = line.project(pos);
            if (!dot) {
                return;
            }
            const vec = pos.clone().sub(dot);
            const distance = vec.mag();
            if (distance <= size) {
                pos.add(vec.div(distance).multiply(size - distance));
                if (line.vertical()) {
                    collide.y = 1;
                }
                if (line.horizontal()) {
                    collide.x = 1;
                }
            }
        });
        if (collide.x || (collide.y && !this.collide.y)) {
            this.speed.y = this.minSpeed.y;
        }
        this.collide = collide;
    }

    turn() {
        this.velocity.x = -this.velocity.x;
        this.speed.x = this.velocity.x < 0
            ? -this.jumpSpeed.x
            : this.jumpSpeed.x;

    }

    jump() {
        const collide = this.collide;
        if (collide.x || collide.y) {
            this.speed.y = this.jumpSpeed.y;
            if (collide.y && !collide.x) {
                this.turn();
            }
        }
    }

}
