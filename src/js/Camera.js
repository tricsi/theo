class Camera {

    constructor(ctx, size, sky) {
        this.ctx = ctx;
        this.sky = sky;
        this.size = size;
        this.pos = new Vec();
        this.resize();
    }

    resize() {
        let ctx = this.ctx,
            size = this.size,
            canvas = ctx.canvas,
            w = canvas.clientWidth,
            h = canvas.clientHeight,
            ratio = w / h;
        if (ratio > 1) {
            canvas.width = Math.round(size * ratio);
            canvas.height = size;
        } else {
            canvas.width = size;
            canvas.height = Math.round(size / ratio);
        }
    }

    render(ctx) {
        let out = this.ctx,
            canvas = out.canvas,
            w = canvas.width,
            h = canvas.height,
            sx = Math.round(this.pos.x) - Math.round(w / 2),
            sy = Math.round(this.pos.y) - Math.round(h / 2),
            dx = 0,
            dy = 0;
        if (sx < 0) {
            dx = -sx;
            sx = 0;
        }
        if (sy < 0) {
            dy = -sy;
            sy = 0;
        }
        out.fillStyle = this.sky;
        out.fillRect(0, 0, w, h);
        out.drawImage(ctx.canvas, sx, sy, w, h, dx, dy, w, h);
    }

}
