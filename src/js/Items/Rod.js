class Rod extends Item {

    pre(draw) {
        let pos = this.pos.clone().sub(12);
        draw.begin()
            .to(pos.x, pos.y - 10)
            .text(["Skipping classes", "again, Theodor?"], 0, 5)
            .end();
    }

    render(draw) {
        let pos = this.pos.clone().sub(12);
        draw.sprite(168, 0, 24, 48, pos.x, pos.y);
    }

}