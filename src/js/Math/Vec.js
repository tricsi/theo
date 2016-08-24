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

    add(value) {
        if (value instanceof Vec) {
            this.x += value.x;
            this.y += value.y;
        } else {
            this.x += value;
            this.y += value;
        }
        return this;
    }

    sub(value) {
        if (value instanceof Vec) {
            this.x -= value.x;
            this.y -= value.y;
        } else {
            this.x -= value;
            this.y -= value;
        }
        return this;
    }

    div(value) {
        this.x = value > 0 ? this.x / value : 0;
        this.y = value > 0 ? this.y / value : 0;
        return this;
    }

    multiply(value) {
        this.x *= value;
        this.y *= value;
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
