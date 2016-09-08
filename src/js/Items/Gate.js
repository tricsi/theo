class Gate extends Door {

    constructor(pos) {
        super(pos);
        this.size = 32;
    }

    pre(draw) {
        let pos = this.pos,
            sky = draw.glin("#09c", "#cff", 0, 0, 0, 64);
        draw.begin()
            .to(pos.x - 36, pos.y - 28)
            .rect(72, 64, sky)
            .to(1, 1)
            .rect(34, 62)
            .stroke(0, 2)
            .to(36, 0)
            .rect(34, 62)
            .stroke(0, 2)
            .to(-1, 36)
            .ngon(6, 10)
            .stroke(0, 2)
            .end();
    }

    render(draw) {}

}