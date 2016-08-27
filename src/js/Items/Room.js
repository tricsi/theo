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
        draw
            .begin()
            .rect(w, h, "#210")
            .path(this.dots)
            .fill("#fec")
            .composite()
            .stroke(0, 2)
            .end();
    }

    collide(pos, size) {
        let collide = new Vec();
        for (let i = 0; i < this.lines.length; i++) {
            let line =  this.lines[i],
                dot = line.project(pos),
                vec = pos.clone().sub(dot),
                distance = vec.mag();
            if (distance < size) {
                pos.add(vec.clone().div(distance).multiply(size - distance));
                if (line.vertical()) {
                    collide.y = 1;
                }
                if (line.horizontal()) {
                    collide.x = 1;
                }
            }
        }
        return collide;
    }

}
