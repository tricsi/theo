class Sprite {

    constructor(renderer) {
        this.renderer = renderer;
    }

    render() {
        const renderer = this.renderer;
        renderer.begin();
        for (let y=1; y>-2; y--) {
            for (let x=-1; x<2; x++) {
                renderer.begin().to(x*24+24, y*24+24);
                this.teo(x, y);
                renderer.end();
            }
        }
        renderer.to(0, 72);
        for (let a=0; a<3; a++) {
            renderer.begin().to(a * 24, 0);
            this.cog(a * 10);
            renderer.end();
        }
        renderer.to(0, 24);
        this.door();
        renderer.end().merge(true);
    }

    door() {
        renderer.begin()
            .rect(24, 32, "#000")
            .to(1, 1)
            .rect(22, 30, "#ccc")
            .to(14, 14)
            .rect(5, 2, "#000")
            .end()

            .begin()
            .to(24, 0)
            .rect(24, 32, "#000")
            .to(12, 19)
            .rect(11, 12, "#666")
            .to(-6, 6)
            .rect(17, 6, "#999")
            .end()

            .begin()
            .to(60, 8)
            .begin()
            .to(-6, 16)
            .rect(6, 8, "#000")
            .to(1, 1)
            .rect(4, 6, "#666")
            .end()
            .begin()
            .to(-3, 0)
            .rect(6, 24, "#000")
            .to(1, 1)
            .rect(4, 22, "#666")
            .end()
            .ellipse(10.5, 7)
            .fill("#666")
            .stroke("#000")
            .ellipse(5, 3)
            .fill("#fff")
            .stroke("#000")
            .end();
    }

    cog(a) {
        this.renderer
            .begin()
            .to(12, 12)
            .rotate(a)
            .ngon(12, 10.5, 8)
            .fill("grey")
            .stroke()
            .ellipse(2.3)
            .fill("black")
            .end();
    }

    teo(x, y) {
        this.renderer
            .begin()
            .to(12, 12)
            .ellipse(10.5)
            .fill("grey")
            .stroke()
            .begin()
            .to(x, y-3)
            .ellipse(5)
            .fill("white")
            .to(x, y)
            .ellipse(2)
            .fill("black")
            .end()
            .to(-3-x, 5+y)
            .rect(6, 1)
            .fill("black")
            .end();
    }
}
