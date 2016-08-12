"use strict";

onload = function () {


    /**
     * Query selector helper
     * @param {string} query
     * @param {Object} element
     */
    function $(query, element) {
        element = element || document;
        return element.querySelector(query);
    }

    /**
     * Create element helper
     * @param {string} name
     * @param {boolean} isText
     * @returns {DOMElement}
     */
    function em(value, isText) {
        return isText
            ? document.createTextNode(value)
            : document.createElement(value);
    }

    /**
     * Event handler helper
     * @param {Object} element
     * @param {string} event
     * @callback handler
     */
    function on(element, event, handler) {
        element.addEventListener(event, handler, false);
    }

    class Vec {

        constructor(x, y) {
            this.x = x || 0;
            this.y = y || 0;
        }

        clone() {
            return new Vec(this.x, this.y);
        }

        eq(vec) {
            return this.x == vec.x && this.y == vec.y;
        }

        mag() {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }

        max(vec) {
            if (this.x > vec.x) {
                this.x = vec.x;
            }
            if (this.x < -vec.x) {
                this.x = -vec.x;
            }
            if (this.y > vec.y) {
                this.y = vec.y;
            }
            if (this.y < -vec.y) {
                this.y = -vec.y;
            }
            return this;
        }

        add(value) {
            if (value instanceof Vec) {
                this.x += value.x;
                this.y += value.y;
            } else {
                this.x += value;
                this.y += value;
            }
            return this;
        }

        sub(value) {
            if (value instanceof Vec) {
                this.x -= value.x;
                this.y -= value.y;
            } else {
                this.x -= value;
                this.y -= value;
            }
            return this;
        }

        div(value) {
            this.x = value > 0 ? this.x / value : 0;
            this.y = value > 0 ? this.y / value : 0;
            return this;
        }

        multiply(value) {
            this.x *= value;
            this.y *= value;
            return this;
        }

        invert() {
            this.x = -this.x;
            this.y = -this.y;
            return this;
        }

        norm() {
            this.div(this.mag());
            return this;
        }

        zero() {
            this.x = 0;
            this.y = 0;
            return this;
        }

        round() {
            this.x = Math.round(this.x);
            this.y = Math.round(this.y);
            return this;
        }

        bit() {
            this.x = this.x > 0 ? 1 : this.x < 0 ? -1 : 0;
            this.y = this.y > 0 ? 1 : this.y < 0 ? -1 : 0;
            return this;
        }

    }

    class Line {

        constructor(begin, end) {
            this.begin = begin;
            this.end = end;
            this.vec = end.clone().sub(begin).norm();
        }

        project(dot) {
            let vec;
            let param = -1;
            let a = dot.clone().sub(this.begin);
            let b = this.end.clone().sub(this.begin);
            if (!this.begin.eq(this.end)) {
                param = (a.x * b.x + a.y * b.y) / (b.x * b.x + b.y * b.y);
            }
            if (param < 0 || param > 1) {
                return false;
            }
            return b.clone().multiply(param).add(this.begin);
        }

        vertical() {
            return this.begin.x == this.end.x;
        }

        horizontal() {
            return this.begin.y == this.end.y;
        }

    }

    class Room {

        constructor(map, grid) {
            let dots = [];
            let lines = [];
            let i = 0;
            let j = 0;
            let x = map[0] * grid;
            let y = map[1] * grid;
            dots.push(new Vec(x, y));
            for (i = 1; i < map.length - 1; i++) {
                if (i % 2) {
                    x = map[i + 1] * grid;
                } else {
                    y = map[i + 1] * grid;
                }
                dots.push(new Vec(x, y));
                if (i % 2) {
                    lines.push(new Line(dots[j], dots[++j]));
                } else {
                    lines.unshift(new Line(dots[j], dots[++j]));
                }
            }
            if (i % 2) {
                lines.push(new Line(dots[j], dots[0]));
            } else {
                lines.unshift(new Line(dots[j], dots[0]));
            }
            this.dots = dots;
            this.lines = lines;
        }

        render(renderer) {
            if (this.img) {
                renderer.img(this.img);
            } else {
                let w = renderer.ctx.canvas.width;
                let h = renderer.ctx.canvas.height;
                this.img = renderer
                    .begin()
                    .to(0, 0)
                    .rect(w, h)
                    .fill("#666")
                    .end()
                    .path(this.dots)
                    .fill("#fff")
                    .stroke()
                    .merge();
            }
        }

    }

    class Hero {

        constructor(x, y, img) {
            this.pos = new Vec(x, y);
            this.img = img;
            this.size = 11;
            this.minSpeed = new Vec(0, 0);
            this.maxSpeed = new Vec(3, 5);
            this.jumpSpeed = new Vec(3, -5);
            this.velocity = new Vec(.1, .15);
            this.collide = new Vec();
            this.speed = this.minSpeed.clone();
        }

        render(renderer) {
            const vec = hero.speed
                .clone()
                .bit()
                .multiply(24)
                .add(24);
            renderer.begin()
                .to(this.pos)
                .to(-12, -12)
                .img(this.img, vec.x, vec.y, 24, 24)
                .end();
        }

        anim(room) {
            const collide = new Vec();
            const size = this.size;
            const speed = this.speed
                .add(this.velocity)
                .max(this.maxSpeed)
                .clone();
            const pos = this.pos.add(speed);
            room.lines.forEach(function (line) {
                const dot = line.project(pos);
                if (!dot) {
                    return;
                }
                const vec = pos.clone().sub(dot);
                const distance = vec.mag();
                if (distance < size) {
                    pos.add(vec.div(distance).multiply(size - distance));
                    if (line.vertical()) {
                        collide.y = 1;
                    }
                    if (line.horizontal()) {
                        collide.x = 1;
                    }
                }
            });
            if (collide.x || (collide.y && !this.collide.y)) {
                this.speed.y = this.minSpeed.y;
            }
            this.collide = collide;
        }

        turn() {
            this.velocity.x = -this.velocity.x;
            this.speed.x = this.velocity.x < 0
                ? -this.jumpSpeed.x
                : this.jumpSpeed.x;

        }

        jump() {
            const collide = this.collide;
            if (collide.x || collide.y) {
                this.speed.y = this.jumpSpeed.y;
                if (collide.y && !collide.x) {
                    this.turn();
                }
            }
        }

    }

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
                .img(ctx.canvas)
                .end();
        }

    }

    class Renderer {

        constructor(ctx) {
            this.ctx = ctx;
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
            ctx.fillStyle = color;
            ctx.fill();
            return this;
        }

        stroke(color, size) {
            const ctx = this.ctx;
            ctx.lineWidth = size || 1;
            ctx.strokeStyle = color || "#000";
            ctx.stroke();
            return this;
        }

        clear(width, height) {
            const canvas = this.ctx.canvas;
            this.ctx.clearRect(0, 0, width || canvas.width, height || canvas.height);
            return this;
        }

        rect(width, height) {
            this.ctx.rect(0, 0, width, height);
            return this;
        }

        ellipse(rad1, rad2, angle) {
            const ctx = this.ctx;
            ctx.beginPath();
            this.ctx.ellipse(0, 0, rad1, rad2 || rad1, angle || 0, 0, 2 * Math.PI);
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

        merge() {
            const img = new Image();
            img.src = this.ctx.canvas.toDataURL();
            return img;
        }

        img(img, x, y, w, h) {
            x = x || 0;
            y = y || 0;
            w = w || img.width;
            h = h || img.height;
            this.ctx.drawImage(img, x, y, w, h, 0, 0, w, h);
            return this;
        }

    }

    class Sprite {

        constructor(renderer) {
            this.renderer = renderer;
        }

        render() {
            const renderer = this.renderer;
            renderer.begin();
            for (let y=1; y>-2; y--) {
                for (let x=-1; x<2; x++) {
                    renderer.begin().to(x*24+24, y*24+24);
                    this.teo(x, y);
                    renderer.end();
                }
            }
            renderer.to(0, 72);
            for (let a=0; a<3; a++) {
                renderer.begin().to(a * 24, 0);
                this.cog(a * 10);
                renderer.to(a * 24, 24).scale(2);
                this.cog(a * 10);
                renderer.end();
            }
            return renderer.end().merge();
        }

        cog(a) {
            this.renderer
                .begin()
                .to(12, 12)
                .rotate(a)
                .ngon(12, 10.5, 8)
                .fill("grey")
                .stroke()
                .ellipse(2.3)
                .fill("black")
                .end();
        }

        teo(x, y) {
            this.renderer
                .begin()
                .to(12, 12)
                .ellipse(10.5)
                .fill("grey")
                .stroke()
                .begin()
                .to(x, y-3)
                .ellipse(5)
                .fill("white")
                .to(x, y)
                .ellipse(2)
                .fill("black")
                .end()
                .to(-3-x, 5+y)
                .rect(6, 1)
                .fill("black")
                .end();
        }
    }

    const ctx = $("#game").getContext("2d");
    const cam = new Camera($("#cam").getContext("2d"), 320);
    const room = new Room([1, 32, 25, 29, 4, 4, 29, 7, 7, 10, 29, 13, 7, 22, 26, 19, 10, 16, 29, 32, 32, 1, 1], 24);
    const renderer = new Renderer(ctx);
    const sprite = new Sprite(renderer).render();
    const hero = new Hero(250, 48, sprite);

    function smooth(ctx, enabled) {
        ctx.imageSmoothingEnabled = enabled;
        ctx.msImageSmoothingEnabled = enabled;
        ctx.mozImageSmoothingEnabled = enabled;
        ctx.webkitImageSmoothingEnabled = enabled;
    }

    function anim() {
        window.requestAnimationFrame(anim);
        room.render(renderer);
        hero.anim(room);
        hero.render(renderer);
        cam.pos = hero.pos;
        cam.render(ctx);
    }

    on(document, "touchstart", function (e) {
        e.preventDefault();
        hero.jump();
    });
    on(document, "mousedown", function (e) {
        e.preventDefault();
        hero.jump();
    });
    on(document, "keydown", function (e) {
        if (e.keyCode == 32) {
            hero.jump();
        }
    });
    on(window, "resize", function () {
        cam.resize();
    });
    smooth(ctx, false);
    anim();

};