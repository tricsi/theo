class Room {

    constructor(grid, margin) {
        this.grid = grid;
        this.margin = margin;
        this.dots = [];
        this.lines = [];
        this.glitch = [];
    }

    map(data) {
        let grid = this.grid;
        let margin = this.margin;
        let lines = this.lines;
        let dots = [];
        let i = 0;
        let j = 0;
        let x = data[0] * grid;
        let y = data[1] * grid;
        dots.push(new Vec(x, y).add(margin));
        for (i = 1; i < data.length - 1; i++) {
            if (i % 2) {
                x = data[i + 1] * grid;
            } else {
                y = data[i + 1] * grid;
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
        this.dots.push(dots);
    }

    pre(draw) {
        let w = draw.ctx.canvas.width;
        let h = draw.ctx.canvas.height;
        draw.begin().rect(w, h, "#210");
        for (let i = 0; i < this.dots.length; i++) {
            draw.path(this.dots[i]).fill(i ? "#210" : "#fec").stroke(0, 2);
        }
        draw.end();
        for (let i = 0; i < this.glitch.length; i++) {
            let line = this.lines[this.glitch[i]];
            draw.begin()
                .to(line.begin)
                .line(line.end.clone().sub(line.begin))
                .shadow("#f0f")
                .stroke("#f0f", 3)
                .end();
        }
    }

    collide(pos, size, glitch) {
        let collide = new Vec();
        for (let i = 0; i < this.lines.length; i++) {
            if (glitch && this.glitch.indexOf(i) > -1) {
                continue;
            }
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
