class Hero {

    constructor(pos) {
        this.pos = pos;
        this.size = 12;
        this.alive = true;
        this.minSpeed = new Vec();
        this.maxSpeed = new Vec(3, 5);
        this.jumpSpeed = new Vec(3, -5);
        this.jumpSfx = new Sfx([2,,0.1108,,0.1802,0.4645,,0.2397,,,,,,0.1456,,,,,0.7264,,,0.2311,,0.5]);
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

    render(draw) {
        const pos = this.pos.clone().sub(12);
        let vec = new Vec(72, 0);
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
        let size = this.size,
            collide = new Vec();
        this.speed.add(this.velocity).max(this.maxSpeed),
        this.pos.add(this.speed);
        for (let i = 0; i < room.lines.length; i++) {
            let line = room.lines[i],
                dot = line.project(this.pos),
                vec = this.pos.clone().sub(dot),
                distance = vec.mag();
            if (distance < size) {
                this.pos.add(vec.clone().div(distance).multiply(size - distance));
                if (line.vertical()) {
                    collide.y = 1;
                }
                if (line.horizontal()) {
                    collide.x = 1;
                }
            }
        }
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
        if (!this.alive) {
            return;
        }
        const collide = this.collide;
        if (collide.x || collide.y) {
            this.speed.y = this.jumpSpeed.y;
            if (collide.y && !collide.x) {
                this.turn();
            }
        }
        this.jumpSfx.play();
    }

}
