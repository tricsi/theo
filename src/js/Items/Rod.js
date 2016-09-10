class Rod extends Item {

    pre(draw) {
        const pos = this.pos.clone().sub(12);
        draw.begin()
            .to(pos.x, pos.y - 10)
            .text(["Skipping classes", "again, Theodor?"], 0, 5, 1)
            .end();
    }

    render(draw) {
        const pos = this.pos.clone().sub(12);
        draw.sprite(168, 0, 24, 48, pos.x, pos.y);
    }

}