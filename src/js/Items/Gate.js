class Gate extends Door {

    constructor(pos, time) {
        super(pos);
        this.size = 32;
        this.time = time;
    }

    pre(draw) {
        let pos = this.pos.clone().sub(36, 28),
            sky = draw.glin("#09c", "#cff", 0, 0, 0, 64),
            min = Math.floor(this.time / 60000) + 100 + "",
            sec = Math.floor(this.time / 1000) % 60 + 100 + "",
            time = min.substr(-2) + ":" + sec.substr(-2);
        draw.begin()
            .to(pos)
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
            .to(-20, -60)
            .text(time, 4, 0)
            .end();
    }

    render(draw) {}

}