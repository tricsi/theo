class Room {

    constructor(map, grid, margin) {
        let dots = [];
        let lines = [];
        let i = 0;
        let j = 0;
        let x = map[0] * grid;
        let y = map[1] * grid;
        dots.push(new Vec(x, y).add(margin));
        for (i = 1; i < map.length - 1; i++) {
            if (i % 2) {
                x = map[i + 1] * grid;
            } else {
                y = map[i + 1] * grid;
            }
            dots.push(new Vec(x, y).add(margin));
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
        let w = draw.ctx.canvas.width;
        let h = draw.ctx.canvas.height;
        this.img = draw
            .begin()
            .rect(w, h, 2)
            .path(this.dots)
            .composite("destination-out")
            .fill(1)
            .composite()
            .stroke(0, 2)
            .end();
    }

}
