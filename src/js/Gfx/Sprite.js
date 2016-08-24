class Sprite {

    constructor(draw) {
        this.draw = draw;
    }

    render(callback) {
        const draw = this.draw;
        draw.begin();
        for (let y=1; y>-2; y--) {
            for (let x=-1; x<2; x++) {
                draw.begin().to(x*24+24, y*24+24);
                this.hero(x, y);
                draw.end();
            }
        }

        draw.begin().to(72, 0);
        this.hero(0, 0, true);
        draw.end();

        draw.to(0, 72);
        for (let a=0; a<3; a++) {
            draw.begin().to(a * 24, 0);
            this.cog(a * 10);
            draw.end();
        }

        draw.to(0, 24);
        this.door();
        draw.end().merge(true, callback);
    }

    door() {
        draw.begin()
            .rect(24, 32, 0)
            .to(1, 1)
            .rect(22, 30, 4)
            .to(14, 14)
            .rect(5, 2, 0)
            .end()

            .begin()
            .to(24, 0)
            .rect(24, 32, 0)
            .to(12, 19)
            .rect(11, 12, 2)
            .to(-6, 6)
            .rect(17, 6, 3)
            .end()

            .begin()
            .to(60, 8)
            .begin()
            .to(-6, 16)
            .rect(6, 8, 0)
            .to(1, 1)
            .rect(4, 6, 2)
            .end()
            .begin()
            .to(-2, 0)
            .rect(6, 24, 0)
            .to(1, 1)
            .rect(4, 22, 2)
            .end()
            .ellipse(10.5, 7)
            .fill(2)
            .stroke(0)
            .ellipse(5, 3)
            .fill(1)
            .stroke(0)
            .end();
    }

    cog(a) {
        this.draw
            .begin()
            .to(12, 12)
            .rotate(a)
            .ngon(12, 11.3, 8)
            .fill(3)
            .stroke()
            .ellipse(2.3)
            .fill(0)
            .end();
    }

    hero(x, y, dead) {
        //head
        this.draw
            .begin()
            .to(12, 12)
            .ellipse(11.3)
            .fill(3)
            .stroke()
            .begin()
            .to(-3-x, 5+y)
            .rect(6, 1, 0)
            .end();
        //eye
        if (dead) {
            this.draw
                .to(-4, -2)
                .rect(8, 2, 0);
        } else {
            this.draw
                .to(x, y-3)
                .ellipse(5)
                .fill(1)
                .to(x, y)
                .ellipse(2)
                .fill(0);
        }
        this.draw.end();
    }
}
