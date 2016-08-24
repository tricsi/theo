class Draw {

    constructor(ctx) {
        this.ctx = ctx;
        this.rgb = ["#000", "#fff", "#666", "#999", "#ccc"];
    }

    begin() {
        this.ctx.save();
        return this;
    }

    end() {
        this.ctx.restore();
        return this;
    }

    scale(x, y) {
        this.ctx.scale(x, y || x);
        return this;
    }

    to(x, y) {
        if (x instanceof Vec) {
            y = x.y;
            x = x.x;
        }
        this.ctx.translate(x, y);
        return this;
    }

    rotate(angle) {
        this.ctx.rotate(2 * Math.PI / angle);
        return this;
    }

    fill(color) {
        const ctx = this.ctx;
        ctx.fillStyle = this.rgb[color || 0];
        ctx.fill();
        return this;
    }

    stroke(color, size) {
        const ctx = this.ctx;
        ctx.lineWidth = size || 1;
        ctx.strokeStyle = this.rgb[color || 0];
        ctx.stroke();
        return this;
    }

    clear(width, height) {
        const canvas = this.ctx.canvas;
        this.ctx.clearRect(0, 0, width || canvas.width, height || canvas.height);
        return this;
    }

    line(x, y) {
        if (x instanceof Vec) {
            y = x.y;
            x = x.x;
        }
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(x, y);
        ctx.closePath();
        return this;
    }

    rect(width, height, color) {
        const ctx = this.ctx;
        if (color !== undefined) {
            ctx.fillStyle = this.rgb[color || 0];
            ctx.fillRect(0, 0, width, height);
            return this;
        }
        ctx.beginPath();
        ctx.rect(0, 0, width, height);
        ctx.closePath();
        return this;
    }

    ellipse(rad1, rad2, angle) {
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.ellipse(0, 0, rad1, rad2 || rad1, angle || 0, 0, 2 * Math.PI);
        ctx.closePath();
        return this;
    }

    ngon(num, rad1, rad2) {
        const ctx = this.ctx;
        ctx.beginPath();
        for (let i = 0; i < num; i++) {
            let a = Math.PI * 2 / num;
            if (i > 0) {
                let b = a * i;
                ctx.lineTo(Math.sin(b) * rad1, Math.cos(b) * rad1);
            } else {
                ctx.moveTo(0, rad1);
            }
            if (rad2) {
                let c = a * (i + 0.5);
                ctx.lineTo(Math.sin(c) * rad2, Math.cos(c) * rad2);
            }
        }
        ctx.closePath();
        return this;
    }

    path(dots) {
        const ctx = this.ctx;
        let dot = dots[0];
        ctx.beginPath();
        ctx.moveTo(dot.x, dot.y);
        for (let i = 1; i < dots.length; i++) {
            dot = dots[i];
            ctx.lineTo(dot.x, dot.y);
        };
        ctx.closePath();
        return this;
    }

    merge(store, callback) {
        let img = new Image();
        img.src = this.ctx.canvas.toDataURL();
        if (store) {
            this.store = img;
        }
        if (callback) {
            img.onload = () => callback.call(img);
        }
        return img;
    }

    img(img, x, y, w, h) {
        this.ctx.drawImage(img, x || 0, y || 0, w || img.width, h || img.height);
        return this;
    }

    sprite(sx, sy, sw, sh, dx, dy, dw, dh) {
        this.ctx.drawImage(this.store, Math.round(sx), Math.round(sy), sw, sh, Math.round(dx || 0), Math.round(dy || 0), dw || sw, dh || sh);
        return this;
    }

}
