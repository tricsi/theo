class Vec {

    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }

    clone() {
        return new Vec(this.x, this.y);
    }

    eq(vec) {
        return this.x == vec.x && this.y == vec.y;
    }

    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    max(vec) {
        if (this.x > vec.x) {
            this.x = vec.x;
        }
        if (this.x < -vec.x) {
            this.x = -vec.x;
        }
        if (this.y > vec.y) {
            this.y = vec.y;
        }
        if (this.y < -vec.y) {
            this.y = -vec.y;
        }
        return this;
    }

    add(x, y) {
        if (x instanceof Vec) {
            y = x.y;
            x = x.x;
        }
        if (y === undefined) {
            y = x;
        }
        this.x += x;
        this.y += y;
        return this;
    }

    sub(x, y) {
        if (x instanceof Vec) {
            y = x.y;
            x = x.x;
        }
        if (y === undefined) {
            y = x;
        }
        this.x -= x;
        this.y -= y;
        return this;
    }

    div(x, y) {
        if (x instanceof Vec) {
            y = x.y;
            x = x.x;
        }
        if (y === undefined) {
            y = x;
        }
        this.x = x > 0 ? this.x / x : 0;
        this.y = y > 0 ? this.y / y : 0;
        return this;
    }

    multiply(x, y) {
        if (x instanceof Vec) {
            y = x.y;
            x = x.x;
        }
        if (y === undefined) {
            y = x;
        }
        this.x *= x;
        this.y *= y;
        return this;
    }

    invert() {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    }

    norm() {
        this.div(this.mag());
        return this;
    }

    zero() {
        this.x = 0;
        this.y = 0;
        return this;
    }

    bit() {
        this.x = this.x > 0 ? 1 : this.x < 0 ? -1 : 0;
        this.y = this.y > 0 ? 1 : this.y < 0 ? -1 : 0;
        return this;
    }

    round() {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        return this;
    }

}
