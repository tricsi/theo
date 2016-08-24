class Camera {

    constructor(size) {
        this.pos = new Vec();
        this.size = size;
        this.scale = 1;
        this.resize();
    }

    resize() {
        const body = document.body;
        let w = body.clientWidth;
        let h = body.clientHeight;
        this.scale = w / h > 1 ? h / this.size : w / this.size;
    }

    render(ctx) {
        const canvas = ctx.canvas;
        let s = this.scale,
            x = Math.round(this.pos.x),
            y = Math.round(this.pos.y);
        canvas.style.transformOrigin = `${x}px ${y}px`;
        canvas.style.transform = `translate(${-x}px, ${-y}px) scale(${s},${s})`;
    }

}
