class Window extends Item {

    pre(draw) {
        let pos = new Vec(-16, -12).add(this.pos);
        draw.sprite(72, 104, 32, 24, pos.x, pos.y);
    }

}