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

        mag() {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }

        eq(vec) {
            return this.x == vec.x && this.y == vec.y;
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
            if (param < 0) {
                return this.begin.clone();
            } else if (param > 1) {
                return this.end.clone();
            }
            return b.clone().multiply(param).add(this.begin);
        }

    }

    class Circle {

        constructor(center, radius) {
            this.center = center;
            this.radius = radius;
        }

        render(ctx, collide) {
            ctx.beginPath();
            ctx.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = collide ? "red" : "green";
            ctx.fill();
        }

    }

    class Room {

        constructor(map) {
            let dots = [];
            let lines = [];
            let j = 0;
            dots.push(new Vec(map[0], map[1]));
            for (let i = 2; i < map.length; i++) {
                dots.push(new Vec(map[i], map[++i]));
                lines.push(new Line(dots[j], dots[++j]));
            }
            lines.push(new Line(dots[j], dots[0]));
            this.dots = dots;
            this.lines = lines;
        }

        render(ctx) {
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

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
            this.speed = new Vec(.5, .7);
            this.collider = new Circle(this.pos, 40);
            this.time = new Date().getTime();
        }

        anim(room) {
            const time = new Date().getTime();
            const circle = this.collider;
            const speed = this.speed.clone().multiply(time - this.time);
            this.time = time;
            room.lines.forEach(function(line) {
                const dot = line.project(circle.center);
                const vec = circle.center.clone().sub(dot);
                const distance = vec.mag();
                if (distance <= circle.radius) {
                    if (Math.round(vec.x) != 0) {
                        speed.x = 0;
                    }
                    if (Math.round(vec.y) != 0) {
                        speed.y = 0;
                    }
                    circle.center.add(vec.div(distance).multiply(circle.radius - distance));
                }
            });
            this.pos.add(speed);
        }

    }

    const ctx = $("#game").getContext("2d");
    const hero = new Hero(160, 400);
    const room = new Room([10, 10, 10, 790,
        380, 790, 380, 400, 420, 400, 420, 790,
        790, 790, 790, 10]);

    function anim() {
        window.requestAnimationFrame(anim);
        room.render(ctx);
        hero.anim(room);
        hero.collider.render(ctx);
    }

    window.onload = anim;

})();