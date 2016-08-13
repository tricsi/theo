class Line {

    constructor(begin, end) {
        this.begin = begin;
        this.end = end;
        this.vec = end.clone().sub(begin).norm();
    }

    project(dot) {
        let vec;
        let param = -1;
        let a = dot.clone().sub(this.begin);
        let b = this.end.clone().sub(this.begin);
        if (!this.begin.eq(this.end)) {
            param = (a.x * b.x + a.y * b.y) / (b.x * b.x + b.y * b.y);
        }
        if (param < 0 || param > 1) {
            return false;
        }
        return b.clone().multiply(param).add(this.begin);
    }

    vertical() {
        return this.begin.x == this.end.x;
    }

    horizontal() {
        return this.begin.y == this.end.y;
    }

}
