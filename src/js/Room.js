class Room {

    constructor(map, grid) {
        let dots = [];
        let lines = [];
        let i = 0;
        let j = 0;
        let x = map[0] * grid;
        let y = map[1] * grid;
        dots.push(new Vec(x, y));
        for (i = 1; i < map.length - 1; i++) {
            if (i % 2) {
                x = map[i + 1] * grid;
            } else {
                y = map[i + 1] * grid;
            }
            dots.push(new Vec(x, y));
            if (i % 2) {
                lines.push(new Line(dots[j], dots[++j]));
            } else {
                lines.unshift(new Line(dots[j], dots[++j]));
            }
        }
        if (i % 2) {
            lines.push(new Line(dots[j], dots[0]));
        } else {
            lines.unshift(new Line(dots[j], dots[0]));
        }
        this.dots = dots;
        this.lines = lines;
    }

    render(draw) {
        if (this.img) {
            draw.img(this.img);
        } else {
            let w = draw.ctx.canvas.width;
            let h = draw.ctx.canvas.height;
            this.img = draw
                .begin()
                .rect(w, h, 2)
                .end()
                .path(this.dots)
                .fill(1)
                .merge();
        }
    }

}
