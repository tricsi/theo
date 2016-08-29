class Window extends Item {

    pre(draw) {
        let pos = this.pos,
            sky = draw.glin("#09c", "#cff", 0, 0, 0, 24);
        draw.begin()
            .to(pos.x - 16, pos.y - 12)
            .rect(32, 24, sky)
            .to(1, 1)
            .rect(10, 22)
            .stroke(0, 2)
            .to(10, 0)
            .rect(10, 22)
            .stroke(0, 2)
            .to(10, 0)
            .rect(10, 22)
            .stroke(0, 2)
            .end();
    }

}