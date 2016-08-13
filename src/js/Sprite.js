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
            renderer.to(a * 24, 24).scale(2);
            this.cog(a * 10);
            renderer.end();
        }
        return renderer.end().merge();
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
