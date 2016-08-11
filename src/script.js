"use strict";

(function () {


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

        add(vec) {
            this.x += vec.x;
            this.y += vec.y;
            return this;
        }

        sub(vec) {
            this.x -= vec.x;
            this.y -= vec.y;
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
            if (param <= 0 || param >= 1) {
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

        render(ctx) {
            if (this.img) {
                ctx.drawImage(this.img, 0, 0);
            } else {
                this.renderBack(ctx);
                this.renderWalls(ctx);
                this.img = new Image();
                this.img.src = ctx.canvas.toDataURL();
            }
        }

        renderBack(ctx) {
            let w = ctx.canvas.width;
            let h = ctx.canvas.height;
            let x = w / 2;
            let y = h / 2;
            const color = ctx.createRadialGradient(x, y, 0, x, y, y);
            color.addColorStop(0, "#960");
            color.addColorStop(1, "#210");
            ctx.fillStyle = color;
            ctx.fillRect(0, 0, w, h);
        }

        renderWalls(ctx) {
            let dot = this.dots[0];
            ctx.beginPath();
            ctx.fillStyle = "white";
            ctx.moveTo(dot.x, dot.y);
            for (let i = 1; i < this.dots.length; i++) {
                dot = this.dots[i];
                ctx.lineTo(dot.x, dot.y);
            };
            ctx.closePath();
            ctx.fill();
        }

    }

    class Hero {

        constructor(x, y) {
            this.pos = new Vec(x, y);
            this.size = 11;
            this.minSpeed = new Vec(0, 0);
            this.maxSpeed = new Vec(3, 5);
            this.jumpSpeed = new Vec(3, -5);
            this.velocity = new Vec(.1, .15);
            this.collide = new Vec();
            this.speed = this.minSpeed.clone();
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
            this.ctx = ctx;
            this.size = size;
            this.resize();
        }

        resize() {
            const canvas = this.ctx.canvas;
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
            this.aspect = canvas.width / canvas.height;
            this.scale = this.aspect > 1 ? canvas.height / this.size : canvas.width / this.size;
        }

        render(ctx, pos) {
            const canvas = this.ctx.canvas;
            let s = this.scale;
            let w = Math.ceil(canvas.width / s);
            let h = Math.ceil(canvas.height / s);
            this.ctx.fillRect(0, 0, canvas.width, canvas.height);
            this.ctx.drawImage(ctx.canvas, pos.x - w / 2, pos.y - h / 2, w, h, 0, 0, w * s, h * s);
        }

    }

    class Sprite {

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

        to(x, y) {
            if (x instanceof Vec) {
                y = x.y;
                x = x.x;
            }
            this.ctx.translate(x, y);
            return this;
        }

        fill(color) {
            const ctx = this.ctx;
            ctx.fillStyle = color;
            ctx.fill();
            return this;
        }

        stroke(color) {
            const ctx = this.ctx;
            ctx.strokeStyle = color;
            ctx.stroke();
            return this;
        }

        circle(radius) {
            const ctx = this.ctx;
            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, 2 * Math.PI, false);
            return this;
        }

        rect(width, height) {
            this.ctx.rect(0, 0, width, height);
            return this;
        }

    }

    const ctx = $("#game").getContext("2d");
    const cam = new Camera($("#cam").getContext("2d"), 300);
    const room = new Room([5, 75, 50, 60, 20, 20, 60, 30, 30, 40, 60, 75, 75, 5, 5], 10);
    const hero = new Hero(250, 155);
    const sprite = new Sprite(ctx);

    function smooth(ctx, enabled) {
        ctx.imageSmoothingEnabled = enabled;
        ctx.msImageSmoothingEnabled = enabled;
        ctx.mozImageSmoothingEnabled = enabled;
        ctx.webkitImageSmoothingEnabled = enabled;
    }

    function anim() {
        window.requestAnimationFrame(anim);
        room.render(ctx);
        hero.anim(room);
        sprite.begin()
            .to(hero.pos)
            .circle(hero.size - .5)
            .fill("grey")
            .stroke("black")
            .to(0, -3)
            .circle(6)
            .fill("white")
            .circle(2)
            .fill("black")
            .to(-1, 8)
            .rect(6, 1)
            .fill("black")
            .end();
        cam.render(ctx, hero.pos);
    }

    window.onload = function (e) {
        on(document, "touchstart", function () {
            e.preventDefault();
            hero.jump();
        });
        on(document, "mousedown", function () {
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
        smooth(cam.ctx, false);
        smooth(ctx, false);
        anim();
    };

})();