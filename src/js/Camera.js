class Camera {

    constructor(ctx, size) {
        this.pos = new Vec();
        this.size = size;
        this.scale = 1;
        this.renderer = new Renderer(ctx);
        this.resize();
    }

    resize() {
        const canvas = this.renderer.ctx.canvas;
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        this.scale = canvas.width / canvas.height > 1
            ? canvas.height / this.size 
            : canvas.width / this.size;
    }

    render(ctx) {
        const canvas = this.renderer.ctx.canvas;
        let w = canvas.width,
            h = canvas.height;
        this.renderer
            .begin()
            .clear(w, h)
            .to(w / 2, h / 2)
            .scale(this.scale)
            .to(-this.pos.x, -this.pos.y)
            .img(0, 0, 0, 0, ctx.canvas)
            .end();
    }

}
