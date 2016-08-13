class Hero {

    constructor(x, y, img) {
        this.pos = new Vec(x, y);
        this.img = img;
        this.size = 11;
        this.minSpeed = new Vec(0, 0);
        this.maxSpeed = new Vec(3, 5);
        this.jumpSpeed = new Vec(3, -5);
        this.velocity = new Vec(.1, .15);
        this.collide = new Vec();
        this.speed = this.minSpeed.clone();
    }

    render(renderer) {
        const vec = hero.speed
            .clone()
            .bit()
            .multiply(24)
            .add(24);
        renderer.begin()
            .to(this.pos)
            .to(-12, -12)
            .img(this.img, vec.x, vec.y, 24, 24)
            .end();
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
            if (distance < size) {
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
